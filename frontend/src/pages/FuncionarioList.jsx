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
import { Edit, Delete, Visibility, FiberNew, PictureAsPdf } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getFuncionarios, deleteFuncionario } from '../services/funcionarioService';
import { useTheme } from '@mui/material/styles';
import html2pdf from 'html2pdf.js';

function FuncionarioList() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [funcionarios, setFuncionarios] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchFuncionarios();
  }, []);

  const fetchFuncionarios = async () => {
    setIsLoading(true);
    try {
      const data = await getFuncionarios();
      if (!Array.isArray(data)) {
        throw new Error('Resposta inválida da API');
      }
      setFuncionarios(data);
    } catch (error) {
      toast.error(`Erro ao buscar funcionários: ${error.message}`, {
        position: 'top-center',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfirm = async (id, nome) => {
    try {
      await deleteFuncionario(id);
      await fetchFuncionarios();
      toast.dismiss();
      toast.success('Funcionário excluído com sucesso!', { position: 'top-center' });
    } catch (error) {
      toast.error(`Erro ao excluir funcionário: ${error.message}`, {
        position: 'top-center',
      });
    }
  };

  const handleDeleteClick = (funcionario) => {
    toast(
      <div>
        <Typography>
          Tem certeza que deseja excluir o funcionário <strong>{funcionario.nome}</strong>?
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => handleDeleteConfirm(funcionario.id_funcionario, funcionario.nome)}
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

  const gerarPDF = () => {
    const elemento = document.getElementById('funcionario-table-pdf');
    const opt = {
      margin: 0.5,
      filename: 'lista_funcionarios.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(elemento).save();
  };

  return (
    <Box
      sx={{
        background: 'linear-gradient(to right, #dbeafe, #bfdbfe)',
        minHeight: '100vh',
        p: 3,
      }}
    >
      <div id="funcionario-table-pdf">
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
              Lista de Funcionários
            </Typography>
            <Box display="flex" gap={1}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#2563eb',
                  ':hover': { backgroundColor: '#1d4ed8' },
                }}
                onClick={() => navigate('/funcionario')}
                startIcon={<FiberNew />}
                aria-label="Adicionar novo funcionário"
              >
                Novo
              </Button>
              <Button
                variant="outlined"
                sx={{
                  color: '#fff',
                  borderColor: '#fff',
                  ':hover': { backgroundColor: '#1d4ed8' },
                }}
                startIcon={<PictureAsPdf />}
                onClick={gerarPDF}
                aria-label="Gerar PDF"
              >
                PDF
              </Button>
            </Box>
          </Toolbar>

          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f1f5f9' }}>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>Nome</strong></TableCell>
                <TableCell><strong>CPF</strong></TableCell>
                {!isSmallScreen && (
                  <>
                    <TableCell><strong>Matrícula</strong></TableCell>
                    <TableCell><strong>Telefone</strong></TableCell>
                    <TableCell><strong>Grupo</strong></TableCell>
                  </>
                )}
                <TableCell><strong>Ações</strong></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={isSmallScreen ? 4 : 7} align="center">
                    <Typography>Carregando...</Typography>
                  </TableCell>
                </TableRow>
              ) : Array.isArray(funcionarios) && funcionarios.length > 0 ? (
                funcionarios.map((funcionario) => (
                  <TableRow hover key={funcionario.id_funcionario}>
                    <TableCell>{funcionario.id_funcionario}</TableCell>
                    <TableCell>{funcionario.nome}</TableCell>
                    <TableCell>{funcionario.cpf}</TableCell>
                    {!isSmallScreen && (
                      <>
                        <TableCell>{funcionario.matricula}</TableCell>
                        <TableCell>{funcionario.telefone}</TableCell>
                        <TableCell>{funcionario.grupo}</TableCell>
                      </>
                    )}
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <Tooltip title="Visualizar">
                          <IconButton
                            color="primary"
                            onClick={() => navigate(`/funcionario/view/${funcionario.id_funcionario}`)}
                            aria-label={`Visualizar funcionário ${funcionario.nome}`}
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar">
                          <IconButton
                            color="secondary"
                            onClick={() => navigate(`/funcionario/edit/${funcionario.id_funcionario}`)}
                            aria-label={`Editar funcionário ${funcionario.nome}`}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Excluir">
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteClick(funcionario)}
                            aria-label={`Excluir funcionário ${funcionario.nome}`}
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
                  <TableCell colSpan={isSmallScreen ? 4 : 7} align="center">
                    <Typography>Nenhum funcionário encontrado</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </Box>
  );
}

export default FuncionarioList;