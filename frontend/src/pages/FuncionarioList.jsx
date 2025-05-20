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
    useMediaQuery
} from '@mui/material';
import { Edit, Delete, Visibility, FiberNew } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getFuncionarios, deleteFuncionario } from '../services/funcionarioService';
import { toast } from 'react-toastify';
import { useTheme } from '@mui/material/styles';

function FuncionarioList() {
    const navigate = useNavigate();
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [funcionarios, setFuncionarios] = useState([]);

    // Buscar os funcionários ao montar o componente
    useEffect(() => {
        fetchFuncionarios();
    }, []);

    // Função para buscar dados da API
    const fetchFuncionarios = async () => {
        try {
            const data = await getFuncionarios();
            setFuncionarios(data);
        } catch (error) {
            console.error('Erro ao buscar funcionários:', error);
        }
    };

    // Função para confirmar exclusão
    const handleDeleteConfirm = async (id) => {
        try {
            await deleteFuncionario(id);
            fetchFuncionarios();
            toast.dismiss(); // Fecha o toast
            toast.success('Funcionário excluído com sucesso!', { position: "top-center" });
        } catch (error) {
            console.error('Erro ao deletar funcionário:', error);
            toast.error('Erro ao excluir funcionário.', { position: "top-center" });
        }
    };

    // Função para mostrar confirmação
    const handleDeleteClick = (funcionario) => {
        toast(
            <div>
                <Typography>Tem certeza que deseja excluir o funcionário <strong>{funcionario.nome}</strong>?</Typography>
                <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained" color="error" size="small"
                        onClick={() => handleDeleteConfirm(funcionario.id_funcionario)}
                        style={{ marginRight: '10px' }}
                    >Excluir</Button>
                    <Button variant="outlined" size="small" onClick={() => toast.dismiss()}>Cancelar</Button>
                </div>
            </div>,
            {
                position: "top-center",
                autoClose: false,
                closeOnClick: false,
                draggable: false,
                closeButton: false,
            }
        );
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Toolbar sx={{ backgroundColor: '#ADD8E6', padding: 2, borderRadius: 1, mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" color="primary">Funcionários</Typography>
                <Button color="primary" onClick={() => navigate('/funcionario')} startIcon={<FiberNew />}>Novo</Button>
            </Toolbar>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#eeeeee' }}>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nome</TableCell>
                            <TableCell>CPF</TableCell>
                            {!isSmallScreen && (
                                <>
                                    <TableCell>Matrícula</TableCell>
                                    <TableCell>Telefone</TableCell>
                                    <TableCell>Grupo</TableCell>
                                </>
                            )}
                            <TableCell>Ações</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {Array.isArray(funcionarios) && funcionarios.map((funcionario) => (
                            <TableRow key={funcionario.id_funcionario}>
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
                                    <IconButton onClick={() => navigate(`/funcionario/view/${funcionario.id_funcionario}`)}>
                                        <Visibility color="primary" />
                                    </IconButton>
                                    <IconButton onClick={() => navigate(`/funcionario/edit/${funcionario.id_funcionario}`)}>
                                        <Edit color="secondary" />
                                    </IconButton>
                                    <IconButton onClick={() => handleDeleteClick(funcionario)}>
                                        <Delete color="error" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>

                </Table>
            </TableContainer>
        </Box>
    );
}

export default FuncionarioList;