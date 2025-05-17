import { root } from '@lynx-js/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import MainScreen from './screens/MainScreen/index.js';
import SplashScreen from './screens/SplashScreen/index.js';
import DetailHadistScreen from './screens/DetailHadistScreen/index.js';

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
