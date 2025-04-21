import React, { useEffect, useRef } from 'react';
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
    Toolbar
} from '@mui/material';
import IMaskInputWrapper from '../components/IMaskInputWrapper';

const FuncionarioForm = () => {
    const { register, handleSubmit, reset, control, formState: { errors } } = useForm();
    const nomeRef = useRef();

    useEffect(() => {
        nomeRef.current?.focus();
    }, []);

    const onSubmit = (data) => {
        console.log("Dados do Funcionario:", data);
    };

    const focusStyle = {
        '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
                borderColor: 'blue',
                borderWidth: '2px'
            }
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{
                backgroundColor: '#ADD8E6',
                padding: 2,
                borderRadius: 1,
                mt: 2
            }}
        >
            <Toolbar
                sx={{
                    backgroundColor: '#ADD8E6',
                    padding: 1,
                    borderRadius: 2,
                    mb: 2,
                    display: 'flex',
                    justifyContent: 'space-between'
                }}
            >
                <Typography variant="h6" color="primary">
                    Dados Funcionário
                </Typography>
            </Toolbar>

            <Box sx={{ backgroundColor: 'white', padding: 2, borderRadius: 3, mb: 2 }}>
                <TextField
                    label="Nome"
                    fullWidth
                    margin="normal"
                    inputRef={nomeRef}
                    sx={focusStyle}
                    {...register('nome', {
                        required: 'Nome é obrigatório',
                        maxLength: {
                            value: 100,
                            message: 'Máximo de 100 caracteres'
                        }
                    })}
                    error={!!errors.nome}
                    helperText={errors.nome?.message}
                />

                <TextField
                    label="CPF"
                    fullWidth
                    margin="normal"
                    sx={focusStyle}
                    {...register('cpf', {
                        required: 'CPF é obrigatório',
                        maxLength: {
                            value: 11,
                            message: 'Máximo de 11 caracteres'
                        }
                    })}
                    error={!!errors.cpf}
                    helperText={errors.cpf?.message}
                />

                <TextField
                    label="Matrícula"
                    fullWidth
                    margin="normal"
                    sx={focusStyle}
                    {...register('matricula', {
                        required: 'Matrícula é obrigatória',
                        maxLength: {
                            value: 11,
                            message: 'Máximo de 11 caracteres'
                        }
                    })}
                    error={!!errors.matricula}
                    helperText={errors.matricula?.message}
                />

                <Controller
                    name="telefone"
                    control={control}
                    rules={{
                        required: 'Telefone é obrigatório',
                        minLength: {
                            value: 14,
                            message: 'Telefone inválido'
                        }
                    }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Telefone"
                            fullWidth
                            margin="normal"
                            sx={focusStyle}
                            InputProps={{
                                inputComponent: IMaskInputWrapper,
                                inputProps: {
                                    mask: '(00) 00000-0000'
                                }
                            }}
                            error={!!errors.telefone}
                            helperText={errors.telefone?.message}
                        />
                    )}
                />

                <FormControl fullWidth margin="normal" sx={focusStyle}>
                    <InputLabel id="grupo-label">Grupo</InputLabel>
                    <Select
                        labelId="grupo-label"
                        label="Grupo"
                        defaultValue=""
                        {...register('grupo')}
                    >
                        <MenuItem value="admin">Admin</MenuItem>
                        <MenuItem value="gerente">Gerente</MenuItem>
                        <MenuItem value="funcionario">Funcionário</MenuItem>
                    </Select>
                </FormControl>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button sx={{ mr: 1 }} onClick={() => reset()}>
                        Cancelar
                    </Button>
                    <Button type="submit" variant="contained">
                        Cadastrar
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default FuncionarioForm;
