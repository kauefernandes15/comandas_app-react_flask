import React, { useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import InputMask from 'react-input-mask';
import {
    TextField,
    Button,
    Box,
    Typography,
    Toolbar
} from '@mui/material';

const ClienteForm = () => {
    const { register, handleSubmit, reset, control, formState: { errors } } = useForm();
    const nomeRef = useRef();

    useEffect(() => {
        nomeRef.current?.focus();
    }, []);

    const onSubmit = (data) => {
        console.log("Dados do cliente:", data);
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
                    Dados do Cliente
                </Typography>
            </Toolbar>

            <Box
                sx={{
                    backgroundColor: 'white',
                    padding: 2,
                    borderRadius: 3,
                    mb: 2
                }}
            >
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

                <Controller
                    name="telefone"
                    control={control}
                    rules={{
                        required: 'Telefone é obrigatório',
                        minLength: {
                            value: 11,
                            message: 'Telefone deve ter 11 dígitos'
                        },
                        maxLength: {
                            value: 11,
                            message: 'Telefone deve ter 11 dígitos'
                        }
                    }}
                    render={({ field }) => (
                        <InputMask
                            mask="(99) 99999-9999"
                            value={field.value}
                            onChange={field.onChange}
                            maskChar=""
                        >
                            {(inputProps) => (
                                <TextField
                                    {...inputProps}
                                    label="Telefone"
                                    fullWidth
                                    margin="normal"
                                    sx={focusStyle}
                                    error={!!errors.telefone}
                                    helperText={errors.telefone?.message}
                                />
                            )}
                        </InputMask>
                    )}
                />

                <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    margin="normal"
                    sx={focusStyle}
                    {...register('email', {
                        required: 'Email Obrigatório',
                        maxLength: {
                            value: 100,
                            message: 'Máximo de 100 caracteres'
                        },
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: 'Email inválido'
                        }
                    })}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                />
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

export default ClienteForm;
