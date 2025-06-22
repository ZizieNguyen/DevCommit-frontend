import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import Layout from './layouts/Layout';

// Importación de las páginas públicas
import HomePage from './pages/HomePage';
import SobreDevCommit from './pages/SobreDevCommit';
import Paquetes from './pages/Paquetes';
import Ponentes from './pages/Ponentes';
import PonenteDetail from './pages/PonenteDetail';
import Eventos from './pages/Eventos';
import NotFoundPage from './pages/NotFoundPage';
import EventoDetail from './pages/EventoDetail.jsx';


// Importación de la página de Auth
import Login from './auth/Login';
import Registro from './auth/Registro';
import OlvidePassword from './auth/OlvidePassword';
import Confirmar from './auth/Confirmar';
import Reestablecer from './auth/Reestablecer';


// Páginas de administrador
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPonentes from './pages/admin/AdminPonentes';
import NuevoPonente from './pages/admin/NuevoPonente';
import EditarPonente from './pages/admin/EditarPonente';
import AdminEventos from './pages/admin/AdminEventos';
import NuevoEvento from './pages/admin/NuevoEvento';
import EditarEvento from './pages/admin/EditarEvento';


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* Ruta principal - Público */}
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="/sobre" element={<SobreDevCommit />} />
              <Route path="/paquetes" element={<Paquetes />} />
              <Route path="/ponentes" element={<Ponentes />} />
              <Route path="/ponentes/:id" element={<PonenteDetail />} />
              <Route path="/eventos" element={<Eventos />} />
              <Route path="/eventos/:id" element={<EventoDetail />} />
              <Route path="*" element={<NotFoundPage />} />
              
            </Route>
        

          {/* Área de autenticación */}
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="login" element={<Login />} />
              <Route path="registro" element={<Registro />} />
              <Route path="olvide-password" element={<OlvidePassword />} />
              <Route path="confirmar/:token" element={<Confirmar />} />
              <Route path="reestablecer/:token" element={<Reestablecer />} />
          </Route>

          {/* Área de administración */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="ponentes" element={<AdminPonentes />} />
            <Route path="ponentes/crear" element={<NuevoPonente />} />
            <Route path="ponentes/editar/:id" element={<EditarPonente />} />
            <Route path="eventos" element={<AdminEventos />} />
            <Route path="eventos/crear" element={<NuevoEvento />} />
            <Route path="eventos/editar/:id" element={<EditarEvento />} />
            {/* <Route path="registrados" element={<AdminRegistrados />} /> */}
            {/* <Route path="regalos" element={<AdminRegalos />} /> */}
            {/* <Route path="perfil" element={<AdminPerfil />} /> */}
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;