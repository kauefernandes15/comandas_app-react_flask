import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Box, Typography, Toolbar } from '@mui/material';
import { createProduto, updateProduto, getProdutoById } from '../services/produtoService';
import { useNavigate, useParams } from "react-router-dom";
import { toast } from 'react-toastify';
import imageCompression from 'browser-image-compression';

const ProdutoForm = () => {
    const { id, opr } = useParams();
    const navigate = useNavigate();
    const { control, handleSubmit, reset, formState: { errors } } = useForm();
    const isReadOnly = opr === 'view';
    let title;
    if (opr === 'view') {
        title = `Visualizar Produto: ${id}`;
    } else if (id) {
        title = `Editar Produto: ${id}`;
    } else {
        title = "Novo Produto";
    }
    const [foto, setFoto] = useState(null);
    const [fotoPreview, setFotoPreview] = useState(null);

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                const options = {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 100,
                    useWebWorker: true
                };
                const compressedFile = await imageCompression(file, options);
                setFoto(compressedFile);
                const previewUrl = URL.createObjectURL(compressedFile);
                setFotoPreview(previewUrl);
            } catch (error) {
                console.error("Erro ao redimensionar a imagem:", error);
                toast.error("Erro ao redimensionar a imagem.");
            }
        } else {
            setFoto(null);
            setFotoPreview(null);
        }
    };

    useEffect(() => {
        if (id) {
            const fetchProduto = async () => {
                const data = await getProdutoById(id);
                reset(data);
                if (data.foto) {
                    setFoto(data.foto);
                    setFotoPreview(data.foto);
                }
            };
            fetchProduto();
        }
    }, [id, reset]);

    const onSubmit = async (data) => {
        try {
            if (!foto && id) {
                const produto = await getProdutoById(id);
                data.foto = produto.foto;
            } else if (foto) {
                data.foto = foto;
            }
            let retorno;
            if (id) {
                retorno = await updateProduto(id, data);
            } else {
                retorno = await createProduto(data);
            }
            if (!retorno?.id) {
                throw new Error(retorno.erro || "Erro ao salvar produto.");
            }
            toast.success(`Produto salvo com sucesso. ID: ${retorno.id}`, { position: "top-center" });
            navigate('/produtos');
        } catch (error) {
            toast.error(`Erro ao salvar produto: \n${error.message}`, { position: "top-center" });
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ backgroundColor: '#ADD8E6', padding: 2, borderRadius: 1, mt: 2 }}>
            <Toolbar sx={{ backgroundColor: '#ADD8E6', padding: 1, borderRadius: 2, mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" gutterBottom color="primary">{title}</Typography>
            </Toolbar>
            <Box sx={{ backgroundColor: 'white', padding: 2, borderRadius: 3, mb: 2 }}>
                {opr === 'view' && (
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                        Todos os campos estão em modo somente leitura.
                    </Typography>
                )}
                <Controller
                    name="nome"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Nome é obrigatório", maxLength: { value: 100, message: "Nome deve ter no máximo 100 caracteres" } }}
                    render={({ field }) => (
                        <TextField {...field} disabled={isReadOnly} label="Nome" fullWidth margin="normal" error={!!errors.nome} helperText={errors.nome?.message} />
                    )}
                />
                <Controller
                    name="descricao"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Descrição é obrigatória", maxLength: { value: 200, message: "Descrição deve ter no máximo 200 caracteres" } }}
                    render={({ field }) => (
                        <TextField {...field} disabled={isReadOnly} label="Descrição" fullWidth margin="normal" error={!!errors.nome} helperText={errors.nome?.message} />
                    )}
                />
                <Controller
                    name="valor_unitario"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Valor é obrigatório", maxLength: { value: 100, message: "Valor deve ter no máximo 100 caracteres" } }}
                    render={({ field }) => (
                        <TextField {...field} type="number" disabled={isReadOnly} label="Valor" fullWidth margin="normal" error={!!errors.nome} helperText={errors.nome?.message} />
                    )}
                />
                <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" gutterBottom color='primary'>Foto do Produto:</Typography>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={isReadOnly}
                        style={{ marginTop: '8px' }}
                    />
                </Box>
                {fotoPreview && (
                    <Box sx={{ mt: 2 }}>
                        <img src={fotoPreview} alt="Pré-visualização" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }} />
                    </Box>
                )}
                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                    <Button onClick={() => navigate('/produtos')} sx={{ mr: 1 }}>Cancelar</Button>
                    {opr !== 'view' && (
                        <Button type="submit" variant="contained" color="primary">{id ? "Atualizar" : "Cadastrar"}</Button>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default ProdutoForm;