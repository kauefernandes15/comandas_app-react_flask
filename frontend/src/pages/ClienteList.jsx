import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Toolbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  useMediaQuery,
  Tooltip,
} from '@mui/material';
import { Edit, Delete, Visibility, FiberNew } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getClientes, deleteCliente } from '../services/clienteService';
import { useTheme } from '@mui/material/styles';

function ClienteList() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [clientes, setClientes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    setIsLoading(true);
    try {
      const data = await getClientes();
      if (!Array.isArray(data)) {
        throw new Error('Resposta inválida da API');
      }
      setClientes(data);
    } catch (error) {
      toast.error(`Erro ao buscar clientes: ${error.message}`, {
        position: 'top-center',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfirm = async (id, nome) => {
    try {
      await deleteCliente(id);
      await fetchClientes();
      toast.dismiss();
      toast.success('Cliente excluído com sucesso!', { position: 'top-center' });
    } catch (error) {
      toast.error(`Erro ao excluir cliente: ${error.message}`, {
        position: 'top-center',
      });
    }
  };

  const handleDeleteClick = (cliente) => {
    toast(
      <div>
        <Typography>
          Tem certeza que deseja excluir o cliente <strong>{cliente.nome}</strong>?
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => handleDeleteConfirm(cliente.id_cliente, cliente.nome)}
          >
            Excluir
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => toast.dismiss()}
          >
            Cancelar
          </Button>
        </Box>
      </div>,
      {
        position: 'top-center',
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        closeButton: false,
      }
    );
  };

  return (
    <Box
      sx={{
        background: 'linear-gradient(to right, #dbeafe, #bfdbfe)',
        minHeight: '100vh',
        p: 3,
      }}
    >
      <TableContainer component={Paper} sx={{ borderRadius: 4, boxShadow: 4 }}>
        <Toolbar
          sx={{
            backgroundColor: '#1e3a8a',
            color: '#fff',
            padding: 2,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Lista de Clientes
          </Typography>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#2563eb',
              ':hover': { backgroundColor: '#1d4ed8' },
            }}
            onClick={() => navigate('/cliente')}
            startIcon={<FiberNew />}
            aria-label="Adicionar novo cliente"
          >
            Novo
          </Button>
        </Toolbar>

        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f1f5f9' }}>
              <TableCell>
                <strong>ID</strong>
              </TableCell>
              <TableCell>
                <strong>Nome</strong>
              </TableCell>
              <TableCell>
                <strong>CPF</strong>
              </TableCell>
              {!isSmallScreen && (
                <TableCell>
                  <strong>Telefone</strong>
                </TableCell>
              )}
              <TableCell>
                <strong>Ações</strong>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={isSmallScreen ? 4 : 5} align="center">
                  <Typography>Carregando...</Typography>
                </TableCell>
              </TableRow>
            ) : Array.isArray(clientes) && clientes.length > 0 ? (
              clientes.map((cliente) => (
                <TableRow hover key={cliente.id_cliente}>
                  <TableCell>{cliente.id_cliente}</TableCell>
                  <TableCell>{cliente.nome}</TableCell>
                  <TableCell>{cliente.cpf}</TableCell>
                  {!isSmallScreen && <TableCell>{cliente.telefone}</TableCell>}
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <Tooltip title="Visualizar">
                        <IconButton
                          color="primary"
                          onClick={() => navigate(`/cliente/view/${cliente.id_cliente}`)}
                          aria-label={`Visualizar cliente ${cliente.nome}`}
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Editar">
                        <IconButton
                          color="secondary"
                          onClick={() => navigate(`/cliente/edit/${cliente.id_cliente}`)}
                          aria-label={`Editar cliente ${cliente.nome}`}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Excluir">
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteClick(cliente)}
                          aria-label={`Excluir cliente ${cliente.nome}`}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={isSmallScreen ? 4 : 5} align="center">
                  <Typography>Nenhum cliente encontrado</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default ClienteList;