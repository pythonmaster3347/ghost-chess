import React, { useMemo } from 'react';
import { Skull, Ghost, Tomb } from '../constants';
import type { BoardEvent } from '../App';

const DECORATION_COUNT = 10;

interface BoardEventsProps {
    event: BoardEvent;
}

const BoardEvents: React.FC<BoardEventsProps> = ({ event }) => {
    const decorations = useMemo(() => {
        if (event === 'none') return [];
        return Array.from({ length: DECORATION_COUNT }).map((_, i) => ({
            id: i,
            top: `${Math.random() * 90 + 5}%`,
            left: `${Math.random() * 90 + 5}%`,
            animationDuration: `${Math.random() * 10 + 5}s`,
            animationDelay: `${Math.random() * 5}s`,
            animationName: Math.random() > 0.5 ? 'roam1' : 'roam2',
            size: `${Math.random() * 3 + 4}%`
        }));
    }, [event]);

    if (event === 'none') {
        return null;
    }
    
    const renderEvent = () => {
        switch (event) {
            case 'skulls':
                return decorations.map(d => (
                    <div key={d.id} className="absolute text-slate-400/50" style={{ top: d.top, left: d.left, width: d.size, height: d.size, animation: `${d.animationName} ${d.animationDuration} ${d.animationDelay} infinite alternate ease-in-out` }}>
                        <Skull />
                    </div>
                ));
            case 'ghosts':
                return decorations.map(d => (
                    <div key={d.id} className="absolute text-slate-200" style={{ top: d.top, left: d.left, width: d.size, height: d.size, animation: `ghost-fade ${d.animationDuration} ${d.animationDelay} infinite ease-in-out` }}>
                        <Ghost />
                    </div>
                ));
            case 'tombs':
                 return decorations.map(d => (
                    <div key={d.id} className="absolute text-slate-600" style={{ top: d.top, left: d.left, width: d.size, height: d.size, animation: `tomb-fade-in 1s ${d.animationDelay} ease-out forwards` }}>
                        <Tomb />
                    </div>
                ));
            default:
                return null;
        }
    }

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-sm">
            {renderEvent()}
        </div>
    );
};

export default BoardEvents;
