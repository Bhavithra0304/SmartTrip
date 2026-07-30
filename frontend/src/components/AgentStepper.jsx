import React from 'react';
import { 
  CheckCircle2, Clock, Loader2, Calendar, DollarSign, 
  CloudSun, Navigation, Sparkles, Ticket, ShieldCheck, Users, Compass
} from 'lucide-react';
import './AgentStepper.css';

const stepIcons = {
  master: Compass,
  planner: Calendar,
  budget: DollarSign,
  weather: CloudSun,
  safety: ShieldCheck,
  crowd: Users,
  events: Ticket,
  recommendation: Sparkles,
  navigation: Navigation
};

const AgentStepper = ({ logs = [], isGenerating = false }) => {
  const defaultSteps = [
    { id: 'master', name: 'Smart Trip Engine', desc: 'Synthesizing travel preferences' },
    { id: 'planner', name: 'Day-Wise Itinerary Planner', desc: 'Structuring morning, afternoon & evening activities' },
    { id: 'budget', name: 'Smart Budget Allocator', desc: '5-category expense split & currency conversion' },
    { id: 'weather', name: 'Weather Intelligence Engine', desc: 'Forecast & rain/heat risk detection' },
    { id: 'safety', name: 'Safety Risk Assessment', desc: 'Live safety score, alerts & emergency POI mapping' },
    { id: 'crowd', name: 'Crowd Density Predictor', desc: 'Attraction peak hours & off-peak visitation times' },
    { id: 'events', name: 'PredictHQ Live Events', desc: 'Local festivals, concerts & food fairs' },
    { id: 'recommendation', name: 'Curated Local Guide', desc: 'Dining, cafés & hidden gems' },
    { id: 'navigation', name: 'Route Transit Optimizer', desc: 'Spatial non-backtracking route matrix' }
  ];

  const getStepStatus = (stepId) => {
    if (!isGenerating && logs.length > 0) return 'completed';
    const logMatches = logs.filter(l => l.agent_id === stepId);
    if (logMatches.some(l => l.status === 'completed')) return 'completed';
    if (logMatches.some(l => l.status === 'running')) return 'running';
    return 'pending';
  };

  return (
    <div className="agent-stepper-card card">
      <div className="stepper-header">
        <div className="stepper-title">
          <Compass size={20} className="master-icon" />
          <h3>Smart Trip Planning Progress Tracker</h3>
        </div>
        <span className={`badge ${isGenerating ? 'badge-warning' : 'badge-success'}`}>
          {isGenerating ? 'Planning Trip...' : 'Trip Plan Ready ✓'}
        </span>
      </div>

      <div className="agent-tree-container">
        {defaultSteps.map((step, index) => {
          const status = getStepStatus(step.id);
          const IconComp = stepIcons[step.id] || Compass;

          return (
            <React.Fragment key={step.id}>
              <div className={`agent-node status-${status}`}>
                <div className="node-left">
                  <div className="icon-wrapper">
                    <IconComp size={18} />
                  </div>
                  <div className="node-info">
                    <h4>{step.name}</h4>
                    <p>{step.desc}</p>
                  </div>
                </div>

                <div className="node-right">
                  {status === 'completed' && (
                    <span className="status-badge completed">
                      <CheckCircle2 size={16} /> Completed ✓
                    </span>
                  )}
                  {status === 'running' && (
                    <span className="status-badge running">
                      <Loader2 size={16} className="spin" /> Processing...
                    </span>
                  )}
                  {status === 'pending' && (
                    <span className="status-badge pending">
                      <Clock size={16} /> Queued
                    </span>
                  )}
                </div>
              </div>

              {index < defaultSteps.length - 1 && (
                <div className="tree-connector">
                  <div className={`connector-line ${status === 'completed' ? 'active' : ''}`}></div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default AgentStepper;
