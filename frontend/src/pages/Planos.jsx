import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from "../services/api";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Container,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';

export default function Planos() {
  const [planos, setPlanos] = useState([]);
  const [locked, setLocked] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);

  const reload = async () => {
    const { data } = await api.get('/planos');
    setPlanos(data || []);
  };

  useEffect(() => { reload(); }, []);

  const toggleSelect = (id) => {
    setSelectedIds((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  };

  const deleteSelected = async () => {
    if (!selectedIds.length) return;
    if (!confirm(`Excluir ${selectedIds.length} plano(s)?`)) return;
    for (const id of selectedIds) {
      try { await api.delete(`/planos/${id}`); } catch {}
    }
    setSelectedIds([]);
    await reload();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h5">Meus Planos</Typography>
        <Stack direction="row" spacing={1}>
          <Button variant={locked ? 'outlined' : 'contained'} onClick={() => setLocked(!locked)}>{locked ? 'Editar' : 'Concluir'}</Button>
          <Button component={Link} to="/plans/new" variant="outlined">Novo Plano</Button>
        </Stack>
      </Box>

      {!locked && (
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Button variant="outlined" color="error" disabled={!selectedIds.length} onClick={deleteSelected}>
            Excluir selecionados {selectedIds.length ? `(${selectedIds.length})` : ''}
          </Button>
          {!!selectedIds.length && (
            <Button size="small" onClick={() => setSelectedIds([])}>Limpar seleção</Button>
          )}
        </Stack>
      )}

      <Card>
        <CardContent>
          <List>
            {planos.map((plano) => (
              <ListItem key={plano.id} divider secondaryAction={
                locked ? (
                  <Button size="small" component={Link} to={`/plans/${plano.id}`}>Abrir</Button>
                ) : null
              }>
                {!locked && (
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Checkbox edge="start" checked={selectedIds.includes(plano.id)} onChange={() => toggleSelect(plano.id)} />
                  </ListItemIcon>
                )}
                <ListItemText primary={plano.titulo} secondary={plano.descricao} />
              </ListItem>
            ))}
            {!planos.length && (
              <Typography color="text.secondary" variant="body2">Nenhum plano encontrado.</Typography>
            )}
          </List>
        </CardContent>
      </Card>
    </Container>
  );
}
