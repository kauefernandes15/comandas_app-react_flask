import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

const LoginForm = lazy(() => import("../pages/LoginForm"));
const Home = lazy(() => import("../pages/Home"));
const FuncionarioList = lazy(() => import("../pages/FuncionarioList"));
const FuncionarioForm = lazy(() => import("../pages/FuncionarioForm"));
const ClienteList = lazy(() => import("../pages/ClienteList"));
const ClienteForm = lazy(() => import("../pages/ClienteForm"));
const ProdutoList = lazy(() => import("../pages/ProdutoList"));
const ProdutoForm = lazy(() => import("../pages/ProdutoForm"));
const NotFound = lazy(() => import("../pages/NotFound"));

const Loading = () => <div>Carregando...</div>;

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/funcionarios" element={<PrivateRoute><FuncionarioList /></PrivateRoute>} />
        <Route path="/funcionario" element={<PrivateRoute><FuncionarioForm /></PrivateRoute>} />
        <Route path="/funcionario/:opr/:id" element={<PrivateRoute> <FuncionarioForm /> </PrivateRoute>} />
        <Route path="/clientes" element={<PrivateRoute><ClienteList /></PrivateRoute>} />
        <Route path="/cliente" element={<PrivateRoute><ClienteForm /></PrivateRoute>} />
        <Route path="/produtos" element={<PrivateRoute><ProdutoList /></PrivateRoute>} />
        <Route path="/produto" element={<PrivateRoute><ProdutoForm /></PrivateRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;