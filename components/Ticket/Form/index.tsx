import React from 'react';
import Button from '@mui/material/Button';
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from '@mui/material/Drawer';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import {ITicket} from "../../../models/ticket";

interface ITicketFormProps {
    isOpen: boolean;
    isLoading: boolean;
    onSubmit: (data: ITicket) => void;
    onClose: () => void;
}
const schema = yup.object({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    email: yup.string().email().required(),
}).required();

const TicketForm = (props: ITicketFormProps) => {
    const { isOpen, isLoading, onSubmit, onClose,  } = props;
    const { register, handleSubmit, formState: { errors } } = useForm({
        mode: 'onTouched',
        resolver: yupResolver(schema),
        shouldUnregister: true,
    });


    return (
        <Drawer
            anchor="right"
            open={isOpen}
            onClose={onClose}
        >
            <Box
                component="form"
                // @ts-ignore
                onSubmit={handleSubmit(onSubmit)}
                sx={{
                    width: '80vw',
                    maxWidth: '570px',
                    position: 'relative',
                }}
            >
                <Box p={2} sx={{ bgcolor: 'background.paper' }}>
                    <Typography variant="h5">
                        Bilet nou
                    </Typography>
                </Box>

                <Divider/>

                <Box sx={{
                    minHeight: 'calc(100vh - 124px)',
                    maxHeight: 'calc(100vh - 124px)',
                    overflowY: 'scroll',
                    p: 3,
                }}>
                    <Grid
                        container
                        spacing={2}
                    >
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                error={!!errors.firstName}
                                label="Nume"
                                required={true}
                                helperText={!!errors.firstName && 'Numele este necesar'}
                                {...register("firstName")}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                error={!!errors.lastName}
                                label="Prenume"
                                required={true}
                                helperText={!!errors.lastName && 'Prenumele este necesar'}
                                {...register("lastName")}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                error={!!errors.email}
                                label="Email"
                                required={true}
                                helperText={!!errors.email && 'Email invalid'}
                                {...register("email")}
                            />
                        </Grid>
                    </Grid>
                </Box>

                <Box sx={{ position: 'sticky', bottom: 0, width: '100%' }}>
                    <Divider />

                    <Box py={1} px={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Box>
                            <Button disabled={isLoading} type="submit" variant="contained">
                                Crează
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Drawer>
    );
}

export default TicketForm;
