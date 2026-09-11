import { lazy, Suspense } from "react";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes as RouterRoutes,
} from "react-router-dom";

import { CartProvider } from "./hooks/useCart";
import PrivateRoute from "./routes/PrivateRoute";

const Home = lazy(() => import("./pages/Home"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const Categoria = lazy(() => import("./pages/admin/Categoria"));
const AddCategoria = lazy(() => import("./pages/admin/Categoria/AddCategoria"));
const EditCategoria = lazy(() => import("./pages/admin/Categoria/EditCategoria"));
const Produto = lazy(() => import("./pages/admin/Produto"));
const AddProduto = lazy(() => import("./pages/admin/Produto/AddProduto"));
const EditProduto = lazy(() => import("./pages/admin/Produto/EditProduto"));
const PedidosGer = lazy(() => import("./pages/admin/PedidosGer"));
const Relatorios = lazy(() => import("./pages/admin/Relatorios"));
const Profile = lazy(() => import("./pages/admin/Profile"));
const Menu = lazy(() => import("./pages/client/Menu"));
const DetailEmpresa = lazy(() => import("./pages/client/Menu/DetailEmpresa"));
const DetailProduto = lazy(() => import("./pages/client/Menu/DetailProduto"));
const Cart = lazy(() => import("./pages/client/Cart"));
const NewPedido = lazy(() => import("./pages/client/Cart/NewPedido"));
const Pedidos = lazy(() => import("./pages/client/Pedidos"));

const CartLayout = () => (
  <CartProvider>
    <Outlet />
  </CartProvider>
);

const RouteFallback = () => <p>Carregando...</p>;

const Routes = () => (
  <BrowserRouter>
    <Suspense fallback={<RouteFallback />}>
      <RouterRoutes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/register" element={<Register />} />

        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/categoria" element={<Categoria />} />
          <Route path="/categoria/new" element={<AddCategoria />} />
          <Route path="/categoria/edit/:idCategoria" element={<EditCategoria />} />
          <Route path="/categoria/:idCategoria/produto" element={<Produto />} />
          <Route path="/categoria/:idCategoria/produto/new" element={<AddProduto />} />
          <Route
            path="/categoria/:idCategoria/produto/edit/:idProduto"
            element={<EditProduto />}
          />
          <Route path="/pedidos/admin" element={<PedidosGer />} />
          <Route path="/relatorios" element={<Relatorios />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route element={<CartLayout />}>
          <Route path="/:subdominio/menu" element={<Menu />} />
          <Route path="/:subdominio/menu/item/:id" element={<DetailProduto />} />
          <Route path="/:subdominio/cart" element={<Cart />} />
          <Route path="/:subdominio/newpedido" element={<NewPedido />} />
          <Route path="/:subdominio/empresa" element={<DetailEmpresa />} />
          <Route path="/:subdominio/pedidos" element={<Pedidos />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </RouterRoutes>
    </Suspense>
  </BrowserRouter>
);

export default Routes;
