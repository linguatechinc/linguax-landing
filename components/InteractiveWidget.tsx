
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { MicrophoneIcon } from './icons';

type Scenario = 'pharma' | 'financial' | 'tech';
type WidgetState = 'idle' | 'permission' | 'recording' | 'analyzing' | 'results';

interface InteractiveWidgetProps {
    onOpenModal: () => void;
}

const AnalysisView: React.FC = () => {
    const { t } = useTranslation();
    const statuses = [
        t('interactiveWidget.analysis.status1'),
        t('interactiveWidget.analysis.status2'),
        t('interactiveWidget.analysis.status3'),
        t('interactiveWidget.analysis.status4')
    ];
    const [currentStatus, setCurrentStatus] = useState(statuses[0]);

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            i = (i + 1) % statuses.length;
            setCurrentStatus(statuses[i]);
        }, 600);
        return () => clearInterval(interval);
    }, [statuses]);
    
    return (
        <div className="text-center max-w-4xl mx-auto bg-[#0F0F1A]/50 border border-gray-800 rounded-2xl p-8 min-h-[400px] flex flex-col items-center justify-center">
            <h3 className="text-2xl font-bold text-white">{t('interactiveWidget.analysis.title')}</h3>
            <div className="relative w-64 h-32 my-6 overflow-hidden">
                <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 256 128">
                     <path d="M0 64 Q 32 10, 64 64 T 128 64 T 192 64 T 256 64" stroke="#4C1D95" strokeWidth="2" fill="none" className="animate-wave" />
                     <path d="M0 64 Q 32 120, 64 64 T 128 64 T 192 64 T 256 64" stroke="#A78BFA" strokeWidth="2" fill="none" className="animate-wave2" />
                </svg>
            </div>
            <p className="font-mono text-violet-300">{currentStatus}</p>
            <style>{`
                .animate-wave { animation: wave 1.5s linear infinite; }
                .animate-wave2 { animation: wave2 1.8s linear infinite; }
                @keyframes wave { 0% { stroke-dasharray: 0 1000; } 50% { stroke-dasharray: 500 500; } 100% { stroke-dasharray: 1000 0; } }
                @keyframes wave2 { 0% { stroke-dasharray: 1000 0; } 50% { stroke-dasharray: 500 500; } 100% { stroke-dasharray: 0 1000; } }
            `}</style>
        </div>
    );
}

const InteractiveWidget: React.FC<InteractiveWidgetProps> = ({ onOpenModal }) => {
    const { t } = useTranslation();
    const [activeScenario, setActiveScenario] = useState<Scenario>('pharma');
    const [widgetState, setWidgetState] = useState<WidgetState>('idle');
    const [analysisResult, setAnalysisResult] = useState<any>(null);
    const [errorMessageKey, setErrorMessageKey] = useState<string | null>(null);
    const [pronouncedWordCount, setPronouncedWordCount] = useState(0);
    const [isMicReady, setIsMicReady] = useState(false);
    
    const mediaRecorder = useRef<MediaRecorder | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const audioContext = useRef<AudioContext | null>(null);
    const analyser = useRef<AnalyserNode | null>(null);
    const animationFrameId = useRef<number | null>(null);
    
    const pronouncedWordCountRef = useRef(0);
    const currentWordProgressRef = useRef(0);
    const lastFrameTimeRef = useRef(0);
    const recordingStartTimeRef = useRef<number>(0);

    const scenarios: Scenario[] = ['pharma', 'financial', 'tech'];
    const WORDS_PER_MINUTE = 120;
    const REQUIRED_COMPLETENESS_TOLERANCE = 0.80;
    const PACING_TOLERANCE_RATIO = 1.35; // Allow up to 35% longer than ideal time
    const PACING_PENALTY_SCALE = 0.6; // Harshness of the penalty

    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const phraseData = useMemo(() => {
        const phrase = t(`interactiveWidget.scenarios.${activeScenario}.phrase`);
        const words = phrase.split(' ');
        const wordCount = words.length;
        const totalChars = words.reduce((acc, word) => acc + word.length, 0);
        const effectiveTotalChars = totalChars + (wordCount > 1 ? wordCount - 1 : 0);
        const requiredDurationMs = (wordCount / WORDS_PER_MINUTE) * 60 * 1000;
        const msPerChar = requiredDurationMs / effectiveTotalChars;

        const wordTimestamps: number[] = [];
        let cumulativeTime = 0;
        words.forEach((word, index) => {
            const wordDuration = (word.length + (index < words.length - 1 ? 1 : 0)) * msPerChar;
            cumulativeTime += wordDuration;
            wordTimestamps.push(cumulativeTime);
        });

        const wordDurations = wordTimestamps.map((ts, i) => {
            const prevTs = i > 0 ? wordTimestamps[i - 1] : 0;
            return ts - prevTs;
        });
        
        return { phrase, words, wordCount, wordTimestamps, wordDurations };
    }, [t, activeScenario]);

    const cleanup = () => {
        if (animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current);
            animationFrameId.current = null;
        }
        if (audioContext.current && audioContext.current.state !== 'closed') {
            audioContext.current.close();
        }
    };

    const detectSpeech = () => {
        if (!analyser.current) return;

        const dataArray = new Uint8Array(analyser.current.fftSize);
        analyser.current.getByteTimeDomainData(dataArray);
        let isSpeaking = false;
        for (let i = 0; i < dataArray.length; i++) {
            if (Math.abs(dataArray[i] - 128) > 10) {
                isSpeaking = true;
                break;
            }
        }

        const now = Date.now();
        const delta = now - lastFrameTimeRef.current;
        lastFrameTimeRef.current = now;

        if (isSpeaking) {
            let currentWordIdx = pronouncedWordCountRef.current;
            if (currentWordIdx < phraseData.wordCount) {
                currentWordProgressRef.current += delta;
                
                while (currentWordIdx < phraseData.wordCount && currentWordProgressRef.current >= phraseData.wordDurations[currentWordIdx]) {
                    currentWordProgressRef.current -= phraseData.wordDurations[currentWordIdx];
                    currentWordIdx++;
                }

                if (pronouncedWordCountRef.current !== currentWordIdx) {
                    pronouncedWordCountRef.current = currentWordIdx;
                    setPronouncedWordCount(currentWordIdx);
                }
            }
        }

        animationFrameId.current = requestAnimationFrame(detectSpeech);
    };

    const prepareMicrophone = async () => {
        setWidgetState('permission');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;
            setIsMicReady(true);
            setWidgetState('idle');
        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert(t('interactiveWidget.permissions.denied'));
            setWidgetState('idle');
        }
    };

    const handleStartRecording = () => {
        if (!isMicReady || !streamRef.current) return;
        
        recordingStartTimeRef.current = Date.now();
        if (errorMessageKey) setErrorMessageKey(null);
        setPronouncedWordCount(0);
        pronouncedWordCountRef.current = 0;
        currentWordProgressRef.current = 0;
        lastFrameTimeRef.current = Date.now();
        setWidgetState('recording');

        mediaRecorder.current = new MediaRecorder(streamRef.current);
        mediaRecorder.current.onstop = () => {
            cleanup();

            const actualDuration = Date.now() - recordingStartTimeRef.current;
            
            if (pronouncedWordCountRef.current === 0) {
                setWidgetState('idle');
                setErrorMessageKey('interactiveWidget.recording.noSpeech');
                setTimeout(() => setErrorMessageKey(null), 2500);
                return;
            }
            
            const completenessRatio = pronouncedWordCountRef.current / phraseData.wordCount;

            if (completenessRatio < REQUIRED_COMPLETENESS_TOLERANCE) {
                setWidgetState('idle');
                setErrorMessageKey('interactiveWidget.recording.incomplete');
                setTimeout(() => setErrorMessageKey(null), 2500);
                return;
            }
            
            runAnalysis(completenessRatio, actualDuration);
        };
        
        audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        analyser.current = audioContext.current.createAnalyser();
        const source = audioContext.current.createMediaStreamSource(streamRef.current);
        source.connect(analyser.current);
        
        mediaRecorder.current.start();
        animationFrameId.current = requestAnimationFrame(detectSpeech);
    };

    const handleStopRecording = () => {
        if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
            mediaRecorder.current.stop();
        } else {
            cleanup();
            setWidgetState('idle');
        }
    };
    
    const runAnalysis = (completenessRatio: number, actualDuration: number) => {
        setWidgetState('analyzing');
        
        setTimeout(() => {
            let qualityScore: number;
    
            if (completenessRatio >= 0.98) {
                qualityScore = Math.floor(Math.random() * (99 - 92 + 1)) + 92;
            } else if (completenessRatio >= 0.90) {
                qualityScore = Math.floor(Math.random() * (91 - 85 + 1)) + 85;
            } else {
                qualityScore = Math.floor(Math.random() * (84 - 78 + 1)) + 78;
            }

            const expectedDuration = phraseData.wordTimestamps[phraseData.wordTimestamps.length - 1];
            const pacingRatio = actualDuration / expectedDuration;
            
            let pacingPenaltyFactor = 1.0;
            if (pacingRatio > PACING_TOLERANCE_RATIO) {
                const excessRatio = pacingRatio - PACING_TOLERANCE_RATIO;
                pacingPenaltyFactor = Math.max(0.4, 1.0 - (excessRatio * PACING_PENALTY_SCALE));
            }
            
            const finalScore = Math.round(qualityScore * (completenessRatio ** 2) * pacingPenaltyFactor);
    
            let qualitativeLabelKey: string;
            if (finalScore >= 90) qualitativeLabelKey = 'elite';
            else if (finalScore >= 80) qualitativeLabelKey = 'convincing';
            else if (finalScore >= 70) qualitativeLabelKey = 'functional';
            else qualitativeLabelKey = 'riskArea';
    
            const qualitativeLabel = t(`interactiveWidget.results.qualitativeLabels.${qualitativeLabelKey}`);
            const cadenceScore = Math.floor(Math.random() * (95 - 55 + 1)) + 55;

            setAnalysisResult({
                score: finalScore,
                cadenceScore,
                qualitativeLabel,
                scenario: activeScenario,
                completenessRatio,
            });
            setWidgetState('results');
        }, 2500);
    };

    const resetWidget = () => {
        setWidgetState('idle');
        setAnalysisResult(null);
        setPronouncedWordCount(0);
    };

    const renderHook = () => (
        <>
            <div className="text-center">
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">{t('interactiveWidget.hook.title')}</h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">{t('interactiveWidget.hook.subtitle')}</p>
            </div>
            <div className="mt-10 max-w-4xl mx-auto bg-[#0F0F1A]/50 border border-gray-800 rounded-2xl p-8 select-none">
                <div className="flex justify-center border-b border-gray-700 mb-6">
                    {scenarios.map(s => (
                        <button 
                            key={s} 
                            onClick={() => { setActiveScenario(s); setPronouncedWordCount(0); currentWordProgressRef.current = 0; }}
                            className={`px-4 py-3 text-sm font-semibold transition-colors duration-200 border-b-2 ${activeScenario === s ? 'text-violet-400 border-violet-400' : 'text-gray-400 border-transparent hover:text-white'}`}
                        >
                            {t(`interactiveWidget.scenarios.${s}.label`)}
                        </button>
                    ))}
                </div>
                <p className="text-center text-gray-300 mb-4">{t(`interactiveWidget.scenarios.${activeScenario}.context`)}</p>
                <div className="text-center font-mono text-lg p-4 bg-gray-900/50 rounded-lg">
                    {phraseData.words.map((word, index) => (
                        <span key={index} className={`transition-colors duration-200 ${index < pronouncedWordCount ? 'text-violet-400' : 'text-white'}`}>
                            {word}{' '}
                        </span>
                    ))}
                </div>
                <div className="mt-8 flex flex-col items-center">
                    {isMicReady ? (
                        <button
                            onMouseDown={handleStartRecording}
                            onMouseUp={handleStopRecording}
                            onTouchStart={handleStartRecording}
                            onTouchEnd={handleStopRecording}
                            className="relative flex items-center justify-center w-20 h-20 bg-violet-600 rounded-full text-white shadow-lg shadow-violet-600/30 hover:bg-violet-700 transition-all duration-300 transform hover:scale-110 focus:outline-none"
                            aria-label={t('interactiveWidget.recording.instruction')}
                        >
                            <MicrophoneIcon className="w-8 h-8"/>
                            {widgetState === 'recording' && <div className="absolute inset-0 rounded-full border-4 border-violet-400 animate-ping"></div>}
                        </button>
                    ) : (
                         <button
                            onClick={prepareMicrophone}
                            className="relative flex items-center justify-center w-20 h-20 bg-violet-600 rounded-full text-white shadow-lg shadow-violet-600/30 hover:bg-violet-700 transition-all duration-300 transform hover:scale-110 focus:outline-none"
                            aria-label={t('interactiveWidget.recording.enableMic')}
                        >
                            <MicrophoneIcon className="w-8 h-8"/>
                        </button>
                    )}
                    <p className="mt-4 text-sm text-gray-500 h-5 flex items-center justify-center">
                        {errorMessageKey ? (
                            <span className="text-amber-400 font-semibold">{t(errorMessageKey)}</span>
                        ) : (
                            <span>
                                {isMicReady 
                                    ? t('interactiveWidget.recording.instruction') 
                                    : t('interactiveWidget.recording.enableMic')}
                            </span>
                        )}
                    </p>
                </div>
            </div>
        </>
    );

    const renderResults = () => {
        if (!analysisResult) return null;
        const { score, cadenceScore, qualitativeLabel, scenario, completenessRatio } = analysisResult;
        const frictionWord = t(`interactiveWidget.scenarios.${scenario}.frictionWord`);
        const phrase = t(`interactiveWidget.scenarios.${scenario}.phrase`);
        const phraseParts = phrase.split(frictionWord);
        
        const ctaText = score > 80 ? 
            t('interactiveWidget.results.cta.highScoreText', { score, diff: 100-score }) :
            t('interactiveWidget.results.cta.lowScoreText', { score, diff: 100-score });
        
        const showFrictionWordAnalysis = completenessRatio > 0.9;

        const scoreColorClass = score <= 65
            ? 'bg-gradient-to-br from-amber-500 to-red-600'
            : 'bg-gradient-to-br from-violet-400 to-blue-500';

        return (
            <div className="max-w-4xl mx-auto bg-[#0F0F1A]/50 border border-gray-800 rounded-2xl p-8">
                 <h3 className="text-2xl font-bold text-white text-center mb-8">{t('interactiveWidget.results.title')}</h3>
                 <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-1 flex flex-col items-center justify-center text-center p-6 bg-gray-900/50 rounded-lg">
                        <p className="text-sm font-semibold text-gray-400 uppercase">{t('interactiveWidget.results.clarityIndexLabel')}</p>
                        <p className={`text-7xl font-extrabold bg-clip-text text-transparent ${scoreColorClass} my-2`}>{score}%</p>
                        <p className="px-3 py-1 text-sm font-semibold rounded-full bg-violet-600/30 text-violet-300">{qualitativeLabel}</p>
                    </div>
                    <div className="md:col-span-2 space-y-6">
                        <div className="p-4 border border-gray-800 rounded-lg">
                            <h4 className="font-bold text-white">{t('interactiveWidget.results.phoneticAnalysis.title')}</h4>
                            <p className="mt-2 text-lg text-gray-300 font-mono">
                                {phraseParts[0]}
                                {showFrictionWordAnalysis ? (
                                    <span className="relative text-amber-400 underline decoration-wavy decoration-amber-400/50 group cursor-pointer">
                                        {frictionWord}
                                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 w-72 mb-2 hidden group-hover:block bg-gray-900 border border-gray-700 text-left p-3 rounded-lg shadow-lg z-10">
                                            <span className="font-sans font-bold text-white text-base">{t('interactiveWidget.results.phoneticAnalysis.tooltipTitle')}</span>
                                            <span className="block mt-1 font-sans text-gray-400 text-sm">{t(`interactiveWidget.scenarios.${scenario}.tooltipAnalysis`)}</span>
                                            <span className="block mt-2 font-sans text-violet-400 text-xs italic">{t(`interactiveWidget.scenarios.${scenario}.tooltipImpact`)}</span>
                                        </span>
                                    </span>
                                ) : (
                                    <span className="text-amber-400">{frictionWord}</span>
                                )}
                                {phraseParts[1]}
                            </p>
                        </div>
                         <div className="p-4 border border-gray-800 rounded-lg">
                            <div className="flex justify-between items-center">
                                <h4 className="font-bold text-white">{t('interactiveWidget.results.prosodyAnalysis.title')}</h4>
                                <p className="text-sm text-gray-400">{t('interactiveWidget.results.prosodyAnalysis.metricLabel')}: <span className="font-bold text-white">{cadenceScore}%</span></p>
                            </div>
                            <div className="mt-2 text-xs text-gray-400">{t('interactiveWidget.results.prosodyAnalysis.impact')}</div>
                        </div>
                    </div>
                 </div>
                 <div className="mt-8 text-center bg-gray-900/50 p-6 rounded-lg">
                    <p className="text-gray-300">{ctaText}</p>
                    <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-4">
                        <button onClick={onOpenModal} className="bg-violet-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg shadow-violet-600/30 hover:bg-violet-700 transition-all duration-300 transform hover:scale-105">
                            {t('interactiveWidget.results.cta.primaryButton')}
                        </button>
                        <button onClick={resetWidget} className="text-gray-400 font-semibold hover:text-white transition-colors">
                            {t('interactiveWidget.results.cta.secondaryButton')}
                        </button>
                    </div>
                 </div>
            </div>
        )
    }

    const renderContent = () => {
        switch (widgetState) {
            case 'idle':
            case 'permission':
            case 'recording':
                return renderHook();
            case 'analyzing':
                return <AnalysisView />;
            case 'results':
                return renderResults();
            default:
                return renderHook();
        }
    };
    
    return (
        <section className="py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {renderContent()}
            </div>
        </section>
    );
};

export default InteractiveWidget;
