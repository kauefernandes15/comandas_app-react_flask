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
  createCliente,
  updateCliente,
  getClienteById,
  checkCpfExists,
} from '../services/clienteService';

const ClienteForm = () => {
  const { id, opr } = useParams();
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nome: '',
      cpf: '',
      telefone: '',
      senha: '',
      grupo: '',
    },
  });

  const isReadOnly = opr === 'view';

  const getTitle = () => {
    if (opr === 'view') return `Visualizar Cliente: ${id}`;
    if (id) return `Editar Cliente: ${id}`;
    return 'Novo Cliente';
  };

  useEffect(() => {
    if (id) {
      const fetchCliente = async () => {
        try {
          const data = await getClienteById(id);
          if (!data) {
            throw new Error('Cliente não encontrado');
          }
          reset(data);
        } catch (error) {
          toast.error(`Erro ao buscar dados do cliente: ${error.message}`, {
            position: 'top-center',
          });
        }
      };
      fetchCliente();
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
      }

      let retorno;
      if (id) {
        retorno = await updateCliente(id, data);
      } else {
        retorno = await createCliente(data);
      }

      if (!retorno || !retorno.id) {
        throw new Error(retorno?.erro || 'Erro ao salvar cliente.');
      }

      toast.success(`Cliente salvo com sucesso. ID: ${retorno.id}`, {
        position: 'top-center',
      });
      navigate('/cliente');
    } catch (error) {
      toast.error(`Erro ao salvar cliente: ${error.message}`, {
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
            {getTitle()}
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
              aria-describedby="nome-helper-text"
            />
          )}
        />

        <Controller
          name="cpf"
          control={control}
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
                  definitions: { '0': /\d/ },
                  unmask: true,
                },
              }}
              aria-describedby="cpf-helper-text"
            />
          )}
        />

        <Controller
          name="telefone"
          control={control}
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
                  definitions: { '0': /\d/ },
                  unmask: true,
                },
              }}
              aria-describedby="telefone-helper-text"
            />
          )}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 2 }}>
          <Button
            onClick={() => navigate('/clientes')}
            variant="outlined"
            color="secondary"
            aria-label="Cancelar"
          >
            Cancelar
          </Button>
          {!isReadOnly && (
            <Button
              type="submit"
              variant="contained"
              color="primary"
              aria-label={id ? 'Atualizar' : 'Cadastrar'}
            >
              {id ? 'Atualizar' : 'Cadastrar'}
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ClienteForm;