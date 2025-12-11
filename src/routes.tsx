import type { ComponentType } from 'react';
import Dashboard from './pages/Dashboard';
import AirfoilGenerationTest from './pages/AirfoilGenerationTest';
import EnhancedGeneration from './pages/EnhancedGeneration';
import RandomAirfoilGenerator from './pages/RandomAirfoilGenerator';
import MLTraining from './pages/MLTraining';

interface RouteConfig {
  name: string;
  path: string;
  component: ComponentType;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Dashboard',
    path: '/',
    component: Dashboard
  },
  {
    name: 'ML Training',
    path: '/training',
    component: MLTraining,
    visible: true
  },
  {
    name: 'Random Generator',
    path: '/random',
    component: RandomAirfoilGenerator,
    visible: true
  },
  {
    name: 'Enhanced Generation',
    path: '/enhanced',
    component: EnhancedGeneration,
    visible: true
  },
  {
    name: 'Airfoil Generation Test',
    path: '/test',
    component: AirfoilGenerationTest,
    visible: true
  }
];

export default routes;