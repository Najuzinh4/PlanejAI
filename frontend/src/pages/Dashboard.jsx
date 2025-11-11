import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  Checkbox,
  ListItemText,
  MenuItem,
  Select,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";

export default function Dashboard() {
  const [plans, setPlans] = useState([]);
  const [currentId, setCurrentId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadPlan = async (id) => {
    const d = await api.get(`/planos/${id}`);
    setDetail(d.data);
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/planos");
        const arr = Array.isArray(data) ? data : [];
        setPlans(arr);
        if (arr.length > 0) {
          const latest = [...arr].sort((a, b) => b.id - a.id)[0];
          setCurrentId(latest.id);
          await loadPlan(latest.id);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const stats = useMemo(() => {
    const itens = detail?.itens || [];
    const total = itens.length;
    const done = itens.filter((i) => !!i.data_fim).length;
    const percent = total ? Math.round((done / total) * 100) : 0;
    return { total, done, percent };
  }, [detail]);

  const toggle = async (itemId) => {
    try {
      await api.patch(`/planos/items/${itemId}/toggle`);
      if (currentId) await loadPlan(currentId);
    } catch {}
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={2} alignItems="stretch">
          <Grid item xs={12} md={6}>
            <Skeleton variant="rounded" height={140} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant="rounded" height={140} />
          </Grid>
          <Grid item xs={12}>
            <Skeleton variant="rounded" height={180} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (!plans.length) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={2}>
          <Typography variant="h5">Bem‑vindo!</Typography>
          <Typography color="text.secondary">
            Você ainda não possui planos. Crie o seu primeiro para começar.
          </Typography>
          <Box>
            <Button variant="contained" onClick={() => navigate("/plans/new")}>Criar Plano</Button>
          </Box>
        </Stack>
      </Container>
    );
  }

  const upcoming = (detail?.itens || []).filter((i) => !i.data_fim).slice(0, 6);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 2, display: "flex", gap: 2, alignItems: "center", justifyContent: "space-between" }}>
        <Typography variant="h5">Dashboard</Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <Select size="small" value={currentId || ""} onChange={(e) => { setCurrentId(e.target.value); loadPlan(e.target.value); }}>
            {plans.map((p) => (
              <MenuItem key={p.id} value={p.id}>{p.titulo} {p.descricao ? `— ${p.descricao}` : ""}</MenuItem>
            ))}
          </Select>
          <Button component={Link} to="/plans/new" variant="outlined">Novo Plano</Button>
        </Stack>
      </Box>
 <Grid container spacing={2} alignItems="stretch">
    <Grid item xs={12} md={6}>
      <Card sx={{ height: "100%" }}>
        <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography variant="h6">Plano atual</Typography>
          <Typography color="text.secondary">
            {detail?.topico || "Sem título"} — {detail?.periodo || "sem período"}
          </Typography>
          <Typography color="text.secondary">
            Progresso: {stats.done}/{stats.total} ({stats.percent}%)
          </Typography>
          <LinearProgress variant="determinate" value={stats.percent} />
          {detail?.id_pe && (
            <Box>
              <Button component={Link} to={`/plans/${detail.id_pe}`} size="small">
                Ver cronograma
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Grid>

    <Grid item xs={12} md={6}>
      <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <CardContent sx={{ display: "flex", flexDirection: "column", flexGrow: 1, minHeight: 0 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Próximas tarefas
          </Typography>
          <Box sx={{ flexGrow: 1, minHeight: 0, overflow: "auto" }}>
            <List dense>
              {upcoming.length ? (
                upcoming.map((t) => (
                  <ListItem key={t.id_item_do_plano} disableGutters>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Checkbox
                        edge="start"
                        checked={!!t.data_fim}
                        onChange={() => toggle(t.id_item_do_plano)}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primaryTypographyProps={{ variant: "body2" }}
                      primary={t.descricao}
                    />
                  </ListItem>
                ))
              ) : (
                <Typography color="text.secondary" variant="body2">
                  Sem tarefas pendentes.
                </Typography>
              )}
            </List>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  </Grid>
</Container>
);
}