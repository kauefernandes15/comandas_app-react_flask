import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
    TextField,
    Button,
    Box,
    Typography,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Toolbar,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import IMaskInputWrapper from '../components/IMaskInputWrapper';
import {
    createFuncionario,
    updateFuncionario,
    getFuncionarioById,
    checkCpfExists,
} from '../services/funcionarioService';
import bcrypt from 'bcryptjs';

const FuncionarioForm = () => {
    const { id, opr } = useParams();
    const navigate = useNavigate();
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const isReadOnly = opr === 'view';

    let title;
    if (opr === 'view') {
        title = `Visualizar Funcionário: ${id}`;
    } else if (id) {
        title = `Editar Funcionário: ${id}`;
    } else {
        title = 'Novo Funcionário';
    }

    useEffect(() => {
        if (id) {
            const fetchFuncionario = async () => {
                try {
                    const data = await getFuncionarioById(id);
                    reset(data);
                } catch (error) {
                    toast.error('Erro ao buscar dados do funcionário.', {
                        position: 'top-center',
                    });
                }
            };
            fetchFuncionario();
        }
    }, [id, reset]);

    const onSubmit = async (data) => {
        try {
            if (!id) {
                const cpfExists = await checkCpfExists(data.cpf);
                if (cpfExists) {
                    toast.error('CPF já está cadastrado no sistema.', {
                        position: 'top-center',
                    });
                    return;
                }

                const salt = bcrypt.genSaltSync(10);
                const hashedPassword = bcrypt.hashSync(data.senha, salt);
                data.senha = hashedPassword;
            }

            let retorno;
            if (id) {
                retorno = await updateFuncionario(id, data);
            } else {
                retorno = await createFuncionario(data);
            }

            if (!retorno || !retorno.id) {
                throw new Error(retorno.erro || 'Erro ao salvar funcionário.');
            }

            toast.success(`Funcionário salvo com sucesso. ID: ${retorno.id}`, {
                position: 'top-center',
            });
            navigate('/funcionarios');
        } catch (error) {
            toast.error(`Erro ao salvar funcionário: \n${error.message}`, {
                position: 'top-center',
            });
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{
                backgroundColor: '#e3f2fd',
                padding: 2,
                borderRadius: 1,
                mt: 2,
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Box
                sx={{
                    backgroundColor: '#fff',
                    padding: 4,
                    borderRadius: 3,
                    maxWidth: 600,
                    width: '100%',
                    boxShadow: 3,
                }}
            >
                <Toolbar
                    sx={{
                        backgroundColor: '#1976d2',
                        padding: 1,
                        borderRadius: 2,
                        mb: 2,
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}
                >
                    <Typography variant="h6" color="white">
                        {title}
                    </Typography>
                </Toolbar>

                {isReadOnly && (
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                        Todos os campos estão em modo somente leitura.
                    </Typography>
                )}

                <Controller
                    name="nome"
                    control={control}
                    defaultValue=""
                    rules={{ required: 'Nome é obrigatório' }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            disabled={isReadOnly}
                            label="Nome"
                            fullWidth
                            margin="normal"
                            error={!!errors.nome}
                            helperText={errors.nome?.message}
                        />
                    )}
                />

                <Controller
                    name="cpf"
                    control={control}
                    defaultValue=""
                    rules={{ required: 'CPF é obrigatório' }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            disabled={isReadOnly}
                            label="CPF"
                            fullWidth
                            margin="normal"
                            error={!!errors.cpf}
                            helperText={errors.cpf?.message}
                            InputProps={{
                                inputComponent: IMaskInputWrapper,
                                inputProps: {
                                    mask: '000.000.000-00',
                                    definitions: {
                                        '0': /\d/,
                                    },
                                    unmask: true,
                                },
                            }}
                        />
                    )}
                />

                <Controller
                    name="telefone"
                    control={control}
                    defaultValue=""
                    rules={{ required: 'Telefone é obrigatório' }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            disabled={isReadOnly}
                            label="Telefone"
                            fullWidth
                            margin="normal"
                            error={!!errors.telefone}
                            helperText={errors.telefone?.message}
                            InputProps={{
                                inputComponent: IMaskInputWrapper,
                                inputProps: {
                                    mask: '(00) 00000-0000',
                                    definitions: {
                                        '0': /\d/,
                                    },
                                    unmask: true,
                                },
                            }}
                        />
                    )}
                />

                <Controller
                    name="matricula"
                    control={control}
                    defaultValue=""
                    rules={{ required: 'Matrícula é obrigatória' }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            disabled={isReadOnly}
                            label="Matrícula"
                            fullWidth
                            margin="normal"
                            error={!!errors.matricula}
                            helperText={errors.matricula?.message}
                        />
                    )}
                />

                <Controller
                    name="senha"
                    control={control}
                    defaultValue=""
                    rules={{
                        required: 'Senha obrigatória',
                        minLength: { value: 6, message: 'Pelo menos 6 caracteres' },
                    }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            disabled={isReadOnly}
                            label="Senha"
                            type="password"
                            fullWidth
                            margin="normal"
                            error={!!errors.senha}
                            helperText={errors.senha?.message}
                        />
                    )}
                />

                <Controller
                    name="grupo"
                    control={control}
                    defaultValue=""
                    rules={{ required: 'Grupo é obrigatório' }}
                    render={({ field }) => (
                        <FormControl fullWidth margin="normal" error={!!errors.grupo}>
                            <InputLabel id="grupo-label">Grupo</InputLabel>
                            <Select
                                {...field}
                                disabled={isReadOnly}
                                labelId="grupo-label"
                                label="Grupo"
                            >
                                <MenuItem value="1">Admin</MenuItem>
                                <MenuItem value="2">Gerente</MenuItem>
                                <MenuItem value="3">Funcionário</MenuItem>
                            </Select>
                            {errors.grupo && (
                                <Typography variant="caption" color="error">
                                    {errors.grupo.message}
                                </Typography>
                            )}
                        </FormControl>
                    )}
                />

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button
                        onClick={() => navigate('/funcionarios')}
                        sx={{ mr: 1 }}
                        variant="outlined"
                    >
                        Cancelar
                    </Button>
                    {!isReadOnly && (
                        <Button type="submit" variant="contained" color="primary">
                            {id ? 'Atualizar' : 'Cadastrar'}
                        </Button>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default FuncionarioForm;