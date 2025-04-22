import { useForm, Controller } from 'react-hook-form'; // incluído controller para as máscaras
import React from "react";
import { TextField, Button, Box, Typography, MenuItem, FormControl, InputLabel, Select, Toolbar } from '@mui/material';
// import do IMaskInputWrapper, que é o wrapper do IMaskInput
import IMaskInputWrapper from '../components/IMaskInputWrapper';
const FuncionarioForm = () => {
    const { control, register, handleSubmit, reset, formState: { errors } } = useForm();
    // o controle é usado para gerenciar o estado do formulário e as entradas controladas, como o IMaskInputWrapper.
    // o controle é necessário para integrar o IMaskInputWrapper com o react-hook-form,
    // permitindo que o valor da entrada seja gerenciado pelo react-hook-form e as validações sejam aplicadas corretamente.
    const onSubmit = (data) => {
        console.log("Dados do funcionário:", data);
    };
    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ backgroundColor: '#ADD8E6', padding: 2, borderRadius: 1, mt: 2 }}>
            {/* CPF com máscara */}
            <Controller
                name="cpf" control={control} defaultValue="" rules={{ required: 'CPF é obrigatório' }}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="CPF" fullWidth margin="normal"
                        error={!!errors.cpf} helperText={errors.cpf?.message}
                        InputProps={{
                            // Define o IMaskInputWrapper como o componente de entrada
                            inputComponent: IMaskInputWrapper,
                            inputProps: {
                                mask: "000.000.000-00",
                                // O regex [0-9] aceita apenas números de 0 a 9
                                definitions: {
                                    "0": /[0-9]/,
                                },
                                // Retorna apenas os números no valor
                                unmask: true,
                            },
                        }}
                    />
                )}
            />
        </Box>
    );
};
export default FuncionarioForm;