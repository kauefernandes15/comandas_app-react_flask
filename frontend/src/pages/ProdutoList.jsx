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
import { getProdutos, deleteProduto } from '../services/produtoService';
import { useTheme } from '@mui/material/styles';
import html2pdf from 'html2pdf.js';

function ProdutoList() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [produtos, setProdutos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchProdutos();
  }, []);

  const fetchProdutos = async () => {
    setIsLoading(true);
    try {
      const data = await getProdutos();
      if (!Array.isArray(data)) {
        throw new Error('Resposta inválida da API');
      }
      setProdutos(data);
    } catch (error) {
      toast.error(`Erro ao buscar produtos: ${error.message}`, {
        position: 'top-center',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfirm = async (id, nome) => {
    try {
      await deleteProduto(id);
      await fetchProdutos();
      toast.dismiss();
      toast.success('Produto excluído com sucesso!', { position: 'top-center' });
    } catch (error) {
      toast.error(`Erro ao excluir produto: ${error.message}`, {
        position: 'top-center',
      });
    }
  };

  const handleDeleteClick = (produto) => {
    toast(
      <div>
        <Typography>
          Tem certeza que deseja excluir o produto <strong>{produto.nome}</strong>?
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => handleDeleteConfirm(produto.id_produto, produto.nome)}
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
    const elemento = document.getElementById('produto-table-pdf');
    const opt = {
      margin: 0.5,
      filename: 'lista_produtos.pdf',
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
      <div id="produto-table-pdf">
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
              Lista de Produtos
            </Typography>
            <Box display="flex" gap={1}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#2563eb',
                  ':hover': { backgroundColor: '#1d4ed8' },
                }}
                onClick={() => navigate('/produto')}
                startIcon={<FiberNew />}
                aria-label="Adicionar novo produto"
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
                <TableCell><strong>Valor</strong></TableCell>
                {!isSmallScreen && (
                  <>
                    <TableCell><strong>Foto</strong></TableCell>
                    <TableCell><strong>Descrição</strong></TableCell>
                  </>
                )}
                <TableCell><strong>Ações</strong></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={isSmallScreen ? 4 : 6} align="center">
                    <Typography>Carregando...</Typography>
                  </TableCell>
                </TableRow>
              ) : Array.isArray(produtos) && produtos.length > 0 ? (
                produtos.map((produto) => (
                  <TableRow hover key={produto.id_produto}>
                    <TableCell>{produto.id_produto}</TableCell>
                    <TableCell>{produto.nome}</TableCell>
                    <TableCell>{produto.valor_unitario}</TableCell>
                    {!isSmallScreen && (
                      <>
                        <TableCell>
                          {produto.foto ? (
                            <img
                              src={produto.foto}
                              alt={produto.nome}
                              style={{ maxWidth: '100px', maxHeight: '100px', borderRadius: '8px' }}
                            />
                          ) : (
                            <Typography variant="body2" color="textSecondary">
                              Sem foto
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>{produto.descricao}</TableCell>
                      </>
                    )}
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <Tooltip title="Visualizar">
                          <IconButton
                            color="primary"
                            onClick={() => navigate(`/produto/view/${produto.id_produto}`)}
                            aria-label={`Visualizar produto ${produto.nome}`}
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar">
                          <IconButton
                            color="secondary"
                            onClick={() => navigate(`/produto/edit/${produto.id_produto}`)}
                            aria-label={`Editar produto ${produto.nome}`}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Excluir">
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteClick(produto)}
                            aria-label={`Excluir produto ${produto.nome}`}
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
                  <TableCell colSpan={isSmallScreen ? 4 : 6} align="center">
                    <Typography>Nenhum produto encontrado</Typography>
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

export default ProdutoList;