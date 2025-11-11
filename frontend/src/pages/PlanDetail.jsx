import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

export default function PlanDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState({ topico: "", periodo: "", tempo: "" });
  const [msg, setMsg] = useState("");
  const [showOnlyPending, setShowOnlyPending] = useState(false);
  const [locked, setLocked] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);

  const stats = useMemo(() => {
    const itens = plan?.itens || [];
    const total = itens.length;
    const done = itens.filter((i) => !!i.data_fim).length;
    const percent = total ? Math.round((done / total) * 100) : 0;
    const totalHoras = itens.reduce((acc, i) => acc + (Number(i.temp) || 0), 0);
    const concluidasHoras = itens.filter((i) => !!i.data_fim).reduce((acc, i) => acc + (Number(i.temp) || 0), 0);
    let plannedWeeks = 0;
    const per = String(plan?.periodo || "").toLowerCase();
    const mSem = per.match(/(\d+)\s*semana/);
    const mMes = per.match(/(\d+)\s*mes/);
    if (mSem && mSem[1]) plannedWeeks = parseInt(mSem[1], 10);
    else if (mMes && mMes[1]) plannedWeeks = parseInt(mMes[1], 10) * 4;
    const plannedHoras = (Number(plan?.tempo) || 0) * plannedWeeks;
    return { total, done, percent, totalHoras, concluidasHoras, plannedHoras, plannedWeeks };
  }, [plan]);

  // Agrupa por semana a partir da descricao ("Semana N ..." ou "Hoje ...")
  const grouped = useMemo(() => {
    const raw = plan?.itens || [];
    const items = showOnlyPending ? raw.filter((i) => !i.data_fim) : raw;
    const map = new Map();
    const getGroup = (desc) => {
      const s = String(desc || "").toLowerCase();
      const w = s.match(/semana\s*(\d+)/i);
      if (w && w[1]) return `Semana ${parseInt(w[1], 10)}`;
      if (s.startsWith("hoje")) return "Hoje";
      return "Outros";
    };
    for (const it of items) {
      const key = getGroup(it.descricao);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(it);
    }
    const keys = Array.from(map.keys());
    keys.sort((a, b) => {
      if (a === "Hoje") return -1; if (b === "Hoje") return 1;
      const ra = a.match(/Semana\s*(\d+)/); const rb = b.match(/Semana\s*(\d+)/);
      if (ra && rb) return parseInt(ra[1], 10) - parseInt(rb[1], 10);
      if (ra) return -1; if (rb) return 1;
      return a.localeCompare(b);
    });
    return keys.map((k) => ({ title: k === "Outros" ? null : k, items: map.get(k) }));
  }, [plan, showOnlyPending]);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/planos/${id}`);
      setPlan(data);
      setEdit({ topico: data.topico || "", periodo: data.periodo || "", tempo: data.tempo || "" });
    } catch (e) {
      setMsg("Erro ao carregar plano");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const save = async () => {
    try {
      await api.put(`/planos/${id}`, { topico: edit.topico, periodo: edit.periodo, tempo: Number(edit.tempo) });
      await load();
      setMsg("Plano atualizado");
      setLocked(true);
    } catch (e) {
      setMsg("Erro ao atualizar plano");
    }
  };

  const duplicate = async () => {
    try {
      const { data } = await api.post(`/planos/${id}/duplicate`);
      navigate(`/plans/${data.id_pe}`);
    } catch (e) { setMsg("Erro ao duplicar"); }
  };

  const remove = async () => {
    if (!confirm("Excluir plano?")) return;
    try { await api.delete(`/planos/${id}`); navigate("/planos"); } catch (e) { setMsg("Erro ao excluir"); }
  };

  const toggleItem = async (itemId) => { try { await api.patch(`/planos/items/${itemId}/toggle`); await load(); } catch {} };
  const updateItem = async (itemId, fields) => { try { await api.put(`/planos/items/${itemId}`, fields); await load(); } catch {} };
  const deleteItem = async (itemId) => { if (!confirm("Remover esta tarefa?")) return; try { await api.delete(`/planos/items/${itemId}`); await load(); } catch {} };

  const toggleSelect = (itemId) => setSelectedIds((cur) => (cur.includes(itemId) ? cur.filter((x) => x !== itemId) : [...cur, itemId]));
  const deleteSelected = async () => {
    if (!selectedIds.length) return;
    if (!confirm(`Excluir ${selectedIds.length} tarefa(s)?`)) return;
    try { for (const itemId of selectedIds) { await api.delete(`/planos/items/${itemId}`); } setSelectedIds([]); await load(); } catch {}
  };

  if (loading) return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography>Carregando...</Typography>
    </Container>
  );
  if (!plan) return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography>Plano não encontrado</Typography>
    </Container>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h5">Plano: {plan.topico || 'Sem título'}</Typography>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={() => setLocked(!locked)}>{locked ? 'Editar' : 'Cancelar'}</Button>
          {!locked && <Button variant="contained" onClick={save}>Salvar</Button>}
          <Button variant="outlined" onClick={duplicate}>Duplicar</Button>
          <Button variant="outlined" color="error" onClick={remove}>Excluir</Button>
        </Stack>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={6} md={3}>
          <Card><CardContent sx={{ textAlign: 'center' }}>
            <Typography color="text.secondary" variant="body2">Total tarefas</Typography>
            <Typography variant="h6">{stats.total}</Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card><CardContent sx={{ textAlign: 'center' }}>
            <Typography color="text.secondary" variant="body2">Concluídas</Typography>
            <Typography variant="h6">{stats.done} ({stats.percent}%)</Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card><CardContent sx={{ textAlign: 'center' }}>
            <Typography color="text.secondary" variant="body2">Horas planejadas</Typography>
            <Typography variant="h6">{stats.plannedHoras}</Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card><CardContent sx={{ textAlign: 'center' }}>
            <Typography color="text.secondary" variant="body2">Horas concluídas</Typography>
            <Typography variant="h6">{stats.concluidasHoras}</Typography>
          </CardContent></Card>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={4}>
          <TextField fullWidth size="small" disabled={locked} label="Tópico" value={edit.topico} onChange={(e) => setEdit({ ...edit, topico: e.target.value })} />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField fullWidth size="small" disabled={locked} label="Período" value={edit.periodo} onChange={(e) => setEdit({ ...edit, periodo: e.target.value })} />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField fullWidth size="small" disabled={locked} label="Tempo (h/sem)" type="number" value={edit.tempo} onChange={(e) => setEdit({ ...edit, tempo: e.target.value })} />
        </Grid>
      </Grid>

      <Stack direction="row" spacing={2} alignItems="center">
        <FormControlLabel control={<Checkbox checked={showOnlyPending} onChange={(e) => setShowOnlyPending(e.target.checked)} />} label="Mostrar só pendentes" />
        {!locked && (
          <>
            <Button variant="outlined" color="error" disabled={!selectedIds.length} onClick={deleteSelected}>
              Excluir selecionadas {selectedIds.length ? `(${selectedIds.length})` : ''}
            </Button>
            {!!selectedIds.length && (
              <Button size="small" onClick={() => setSelectedIds([])}>Limpar seleção</Button>
            )}
          </>
        )}
      </Stack>

      {msg && <Typography sx={{ mt: 1 }} color="text.secondary" variant="body2">{msg}</Typography>}

      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Itens</Typography>
        {!grouped.length && (<Typography color="text.secondary" variant="body2">Sem itens.</Typography>)}
        <Stack spacing={2}>
          {grouped.map((grp, gi) => (
            <Card key={gi} variant="outlined">
              <CardContent>
                {grp.title && (<Typography variant="subtitle1" sx={{ mb: 1 }}>{grp.title}</Typography>)}
                <Divider sx={{ mb: 1 }} />
                <List dense>
                  {grp.items.map((it) => (
                    <ListItem key={it.id_item_do_plano} sx={{ alignItems: 'flex-start' }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        {locked ? (
                          <Checkbox edge="start" checked={!!it.data_fim} onChange={() => toggleItem(it.id_item_do_plano)} />
                        ) : (
                          <Checkbox edge="start" checked={selectedIds.includes(it.id_item_do_plano)} onChange={() => toggleSelect(it.id_item_do_plano)} />
                        )}
                      </ListItemIcon>
                      <ListItemText primaryTypographyProps={{ variant: 'body2' }} primary={it.descricao} />
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ ml: 2 }}>
                        <TextField size="small" type="date" label="Início" InputLabelProps={{ shrink: true }} value={it.data_inicio || ''} onChange={(e) => updateItem(it.id_item_do_plano, { data_inicio: e.target.value })} />
                        <TextField size="small" type="number" label="Horas" value={it.temp ?? ''} onChange={(e) => updateItem(it.id_item_do_plano, { temp: Number(e.target.value) })} sx={{ width: 120 }} />
                        <Button size="small" color="error" variant="outlined" onClick={() => deleteItem(it.id_item_do_plano)}>Excluir</Button>
                      </Stack>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>
    </Container>
  );
}
