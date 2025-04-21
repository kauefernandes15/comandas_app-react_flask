import { useForm } from 'react-hook-form';
import React, { useEffect, useRef } from 'react';
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

const ProdutoForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const nomeRef = useRef();

    useEffect(() => {
        nomeRef.current?.focus();
    }, []);

    const onSubmit = (data) => {
        console.log("Dados do produto:", data);
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
                    Dados do Produto
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
                    label="Categoria"
                    fullWidth
                    margin="normal"
                    sx={focusStyle}
                    {...register('categoria', { required: 'Categoria é obrigatória' })}
                    error={!!errors.categoria}
                    helperText={errors.categoria?.message}
                />

                <TextField
                    label="Preço"
                    type="number"
                    fullWidth
                    margin="normal"
                    inputProps={{ step: "0.01" }}
                    sx={focusStyle}
                    {...register('preco', {
                        required: 'Preço é obrigatório',
                        min: { value: 0, message: 'Preço deve ser maior ou igual a zero' }
                    })}
                    error={!!errors.preco}
                    helperText={errors.preco?.message}
                />

                <TextField
                    label="Estoque"
                    type="number"
                    fullWidth
                    margin="normal"
                    sx={focusStyle}
                    {...register('estoque', {
                        required: 'Estoque é obrigatório'
                    })}
                    error={!!errors.estoque}
                    helperText={errors.estoque?.message}
                />

                <FormControl fullWidth margin="normal" sx={focusStyle}>
                    <InputLabel id="status-label">Status</InputLabel>
                    <Select
                        labelId="status-label"
                        label="Status"
                        defaultValue=""
                        {...register('status', { required: 'Status é obrigatório' })}
                        error={!!errors.status}
                    >
                        <MenuItem value="ativo">Ativo</MenuItem>
                        <MenuItem value="inativo">Inativo</MenuItem>
                    </Select>
                    {errors.status && (
                        <Typography variant="caption" color="error">
                            {errors.status.message}
                        </Typography>
                    )}
                </FormControl>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button sx={{ mr: 1 }}>
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

export default ProdutoForm;
