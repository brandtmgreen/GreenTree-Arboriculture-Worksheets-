/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Layout from './components/Layout';
import { EstimateForm } from './components/EstimateForm';
import { TreeRiskAssessment } from './components/TreeRiskAssessment';
import { JobBriefing } from './components/JobBriefing';
import { HealthAssessment } from './components/HealthAssessment';
import { MediaDocumentation } from './components/MediaDocumentation';
import { WeeklySafetyMeeting } from './components/WeeklySafetyMeeting';
import { EquipmentInspection } from './components/EquipmentInspection';
import { TreeInventory } from './components/TreeInventory';
import { StormDamageAssessment } from './components/StormDamageAssessment';
import { PostWorkVerification } from './components/PostWorkVerification';
import { DroneOperationsWorksheet } from './components/DroneOperationsWorksheet';
import { BlankWorksheetTemplates } from './components/BlankWorksheetTemplates';
import { SiteProvider } from './context/SiteContext';
import { FirebaseProvider } from './context/FirebaseContext';
import { ErrorBoundary } from './components/ErrorBoundary';

function AppContent() {
  const [activeTab, setActiveTab] = useState('estimate');

  const renderContent = () => {
    switch (activeTab) {
      case 'estimate':
        return <EstimateForm />;
      case 'tree-risk':
      case 'risk':
        return <TreeRiskAssessment />;
      case 'briefing':
        return <JobBriefing />;
      case 'health':
        return <HealthAssessment />;
      case 'inventory':
        return <TreeInventory />;
      case 'drone':
        return <DroneOperationsWorksheet />;
      case 'storm':
        return <StormDamageAssessment />;
      case 'postwork':
        return <PostWorkVerification />;
      case 'safety':
        return <WeeklySafetyMeeting />;
      case 'equipment':
        return <EquipmentInspection />;
      case 'media':
        return <MediaDocumentation />;
      default:
        return <EstimateForm />;
    }
  };

  return (
    <SiteProvider>
      <div id="interactive-app" className="min-h-screen">
        <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
          {renderContent()}
        </Layout>
      </div>
      <BlankWorksheetTemplates />
    </SiteProvider>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <FirebaseProvider>
        <AppContent />
      </FirebaseProvider>
    </ErrorBoundary>
  );
}
