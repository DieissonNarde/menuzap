import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import type { ChangeEvent } from "react";

import { InputHour } from "../../../components/InputMasks";

type TextInputEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

const WEEK_DAYS = [
  ["domingo", "Domingo"],
  ["segunda", "Segunda"],
  ["terca", "Terça"],
  ["quarta", "Quarta"],
  ["quinta", "Quinta"],
  ["sexta", "Sexta"],
  ["sabado", "Sábado"],
] as const;

interface DaySelectProps {
  id: string;
  value: string;
  onChange: (event: SelectChangeEvent<string>) => void;
}

const DaySelect = ({ id, value, onChange }: DaySelectProps) => (
  <Select id={id} value={value} onChange={onChange} fullWidth>
    {WEEK_DAYS.map(([day, label]) => (
      <MenuItem key={day} value={day}>
        {label}
      </MenuItem>
    ))}
  </Select>
);

interface HoursRangeProps {
  title: string;
  start: string;
  end: string;
  onStartChange: (event: TextInputEvent) => void;
  onEndChange: (event: TextInputEvent) => void;
}

const HoursRange = ({
  title,
  start,
  end,
  onStartChange,
  onEndChange,
}: HoursRangeProps) => (
  <Grid size={{ xs: 12, sm: 6 }}>
    <Grid sx={{ mx: 1, justifyContent: "space-between" }} container size={12}>
      <Grid size={12}>
        <Typography sx={{ flexGrow: 1, color: "#A9A9A9" }} gutterBottom variant="h6" component="h6">
          {title}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, sm: 5 }}>
        <InputHour value={start} onChange={onStartChange} />
      </Grid>
      <Typography component="span" sx={{ fontSize: 12, fontWeight: "bold", alignSelf: "center" }}>
        ÀS
      </Typography>
      <Grid size={{ xs: 12, sm: 5 }}>
        <InputHour value={end} onChange={onEndChange} />
      </Grid>
    </Grid>
  </Grid>
);

interface BusinessHoursProps {
  startDay: string;
  endDay: string;
  onStartDayChange: (event: SelectChangeEvent<string>) => void;
  onEndDayChange: (event: SelectChangeEvent<string>) => void;
  normalStart: string;
  normalEnd: string;
  onNormalStartChange: (event: TextInputEvent) => void;
  onNormalEndChange: (event: TextInputEvent) => void;
  holidayStart: string;
  holidayEnd: string;
  onHolidayStartChange: (event: TextInputEvent) => void;
  onHolidayEndChange: (event: TextInputEvent) => void;
}

const BusinessHours = ({
  startDay,
  endDay,
  onStartDayChange,
  onEndDayChange,
  normalStart,
  normalEnd,
  onNormalStartChange,
  onNormalEndChange,
  holidayStart,
  holidayEnd,
  onHolidayStartChange,
  onHolidayEndChange,
}: BusinessHoursProps) => (
  <>
    <Grid size={12}>
      <h5>Horário de Funcionamento</h5>
    </Grid>
    <Grid size={12}>
      <Typography sx={{ flexGrow: 1, color: "#A9A9A9" }} gutterBottom variant="h6" component="h6">
        Semana
      </Typography>
    </Grid>
    <Grid sx={{ mx: 1, justifyContent: "space-between" }} container spacing={3}>
      <Grid size={{ xs: 12, sm: 5 }}>
        <DaySelect id="inicioSemanaAberto" value={startDay} onChange={onStartDayChange} />
      </Grid>
      <Typography component="span" sx={{ fontSize: 14, fontWeight: "bold", alignSelf: "center" }}>
        À
      </Typography>
      <Grid size={{ xs: 12, sm: 5 }}>
        <DaySelect id="fimSemanaAberto" value={endDay} onChange={onEndDayChange} />
      </Grid>
    </Grid>
    <HoursRange
      title="Horário Normal"
      start={normalStart}
      end={normalEnd}
      onStartChange={onNormalStartChange}
      onEndChange={onNormalEndChange}
    />
    <HoursRange
      title="Horário Feriado"
      start={holidayStart}
      end={holidayEnd}
      onStartChange={onHolidayStartChange}
      onEndChange={onHolidayEndChange}
    />
  </>
);

export default BusinessHours;
