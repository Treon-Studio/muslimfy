import { root } from '@lynx-js/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import MainScreen from './screens/MainScreen/index.jsx';
import SplashScreen from './screens/SplashScreen/index.jsx';
import DetailHadistScreen from './screens/DetailHadistScreen/index.jsx';

root.render(
  <MemoryRouter>
    <Routes>
      <Route path="/" element={<SplashScreen />} />
      <Route path="/home" element={<MainScreen />} />
      <Route path="/hadist/:id" element={<DetailHadistScreen />} />
    </Routes>
  </MemoryRouter>,
);

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
}
