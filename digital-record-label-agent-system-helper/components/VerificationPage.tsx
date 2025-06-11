import React, { useState } from 'react';
import { VERIFICATION_STEPS_DATA } from '../constants';
import { VerificationStep, VerificationSubStep } from '../types';
import { ChevronDownIcon, ChevronUpIcon } from './icons';

interface VerificationSubStepItemProps {
  subStep: VerificationSubStep;
  category: string;
}

const VerificationSubStepItem: React.FC<VerificationSubStepItemProps> = ({ subStep, category }) => {
  const [isVerified, setIsVerified] = useState(false);
  const uniqueId = `${category}-${subStep.id}`;

  return (
    <li className="flex items-start space-x-3 py-3 px-4 bg-gray-750 rounded-md">
      <input
        id={uniqueId}
        type="checkbox"
        checked={isVerified}
        onChange={() => setIsVerified(!isVerified)}
        className="form-checkbox h-5 w-5 mt-0.5" // Uses custom .form-checkbox style from index.html
      />
      <label htmlFor={uniqueId} className={`flex-1 text-sm ${isVerified ? 'line-through text-gray-500' : 'text-gray-200'}`}>
        {subStep.text}
        {subStep.statusCommand && (
          <span className="block text-xs text-gray-400 mt-1 font-mono bg-neutral-dark px-2 py-1 rounded">
            e.g., <code >{subStep.statusCommand}</code>
          </span>
        )}
      </label>
    </li>
  );
};


interface VerificationCategoryProps {
  step: VerificationStep;
}

const VerificationCategory: React.FC<VerificationCategoryProps> = ({ step }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-neutral-dark shadow-md rounded-lg p-3 sm:p-6 border border-gray-700">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex justify-between items-center text-left mb-4"
      >
        <div>
          <h3 className="text-lg font-semibold text-primary-light">{step.title}</h3>
          <p className="text-sm text-gray-400">{step.details}</p>
        </div>
        {isExpanded ? <ChevronUpIcon className="w-6 h-6 text-gray-400" /> : <ChevronDownIcon className="w-6 h-6 text-gray-400" />}
      </button>
      
      {isExpanded && step.subSteps && (
        <ul className="space-y-3">
          {step.subSteps.map(subStep => (
            <VerificationSubStepItem key={subStep.id} subStep={subStep} category={step.id}/>
          ))}
        </ul>
      )}
    </div>
  );
};


const VerificationPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-text-dark-primary mb-6">System Verification Checklist</h2>
      {VERIFICATION_STEPS_DATA.map(step => (
        <VerificationCategory key={step.id} step={step} />
      ))}
    </div>
  );
};

export default VerificationPage;
