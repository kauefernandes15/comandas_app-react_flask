import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Toolbar, Typography, IconButton, Button, useMediaQuery } from '@mui/material';
import { Edit, Delete, Visibility, FiberNew } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getProdutos, deleteProduto } from '../services/produtoService';
import { toast } from 'react-toastify';
import { useTheme } from '@mui/material/styles';

function ProdutoList() {
    const navigate = useNavigate();
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [produtos, setProdutos] = useState([]);

    useEffect(() => {
        fetchProdutos();
    }, []);

    const fetchProdutos = async () => {
        try {
            const data = await getProdutos();
            setProdutos(data);
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
        }
    };

    const handleDeleteClick = (produto) => {
        toast(
            <div>
                <Typography>Tem certeza que deseja excluir o produto <strong>{produto.nome}</strong>?</Typography>
                <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained" color="error" size="small"
                        onClick={() => handleDeleteConfirm(produto.id_produto)} style={{ marginRight: '10px' }}
                    >Excluir</Button>
                    <Button variant="outlined" size="small" onClick={() => toast.dismiss()}>Cancelar</Button>
                </div>
            </div>,
            {
                position: "top-center", autoClose: false, closeOnClick: false, draggable: false, closeButton: false
            }
        );
    };

    const handleDeleteConfirm = async (id) => {
        try {
            await deleteProduto(id);
            fetchProdutos();
            toast.dismiss();
            toast.success('Produto excluído com sucesso!', { position: "top-center" });
        } catch (error) {
            console.error('Erro ao deletar produto:', error);
            toast.error('Erro ao excluir produto.', { position: "top-center" });
        }
    };

    return (
        <TableContainer component={Paper}>
            <Toolbar sx={{ backgroundColor: '#ADD8E6', padding: 2, borderRadius: 1, mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" color="primary">Produtos</Typography>
                <Button color="primary" onClick={() => navigate('/produto')} startIcon={<FiberNew />}>Novo</Button>
            </Toolbar>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Nome</TableCell>
                        <TableCell>Valor</TableCell>
                        {!isSmallScreen && (
                            <>
                                <TableCell>Foto</TableCell>
                                <TableCell>Descrição</TableCell>
                            </>
                        )}
                        <TableCell>Ações</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {produtos.map((produto) => (
                        <TableRow key={produto.id_produto}>
                            <TableCell>{produto.id_produto}</TableCell>
                            <TableCell>{produto.nome}</TableCell>
                            <TableCell>{produto.valor_unitario}</TableCell>
                            {!isSmallScreen && (
                                <>
                                    <TableCell>
                                        {produto.foto ? (
                                            <img src={produto.foto} alt={produto.nome} style={{ maxWidth: '100px', maxHeight: '100px', borderRadius: '8px' }} />
                                        ) : (
                                            <Typography variant="body2" color="textSecondary">Sem foto</Typography>
                                        )}
                                    </TableCell>
                                    <TableCell>{produto.descricao}</TableCell>
                                </>
                            )}
                            <TableCell>
                                <IconButton onClick={() => navigate(`/produto/view/${produto.id_produto}`)}>
                                    <Visibility color="primary" />
                                </IconButton>
                                <IconButton onClick={() => navigate(`/produto/edit/${produto.id_produto}`)}>
                                    <Edit color="secondary" />
                                </IconButton>
                                <IconButton onClick={() => handleDeleteClick(produto)}>
                                    <Delete color="error" />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default ProdutoList;