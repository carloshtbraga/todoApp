
import { BrowserRouter, Routes, Route } from 'react-router-dom';


import Login from '../components/Login';
import Tasks from '../components/Tasks';

export default function Rotas() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/tasks" element={<Tasks />} />
 
      </Routes>
    </BrowserRouter>
  )
}
