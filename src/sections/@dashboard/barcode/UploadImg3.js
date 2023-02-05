import { Alert, Box, Button, Chip, CircularProgress, Grid, TextField } from '@mui/material'
import React, { useState, useEffect, useContext } from 'react'
import ImageUploader from 'react-image-upload'
import { v4 as uuidv4 } from 'uuid';
import 'react-image-upload/dist/index.css'
import {
    ref,
    uploadBytes,
    getDownloadURL,
    listAll,
    list,
} from "firebase/storage";
import { LoadingButton } from '@mui/lab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { faker } from '@faker-js/faker';
import NewsServices from '../../../services/NewsServices';
import { storage } from "../../../firebase/config"
import BarcodeService from '../../../services/BarcodeService';
import AddProduct from '../app/AddProduct';
import Loader from '../../../helpers/Loader';
import ProductServices from '../../../services/ProductServices';
import { kpupContext } from '../../../context';
import successHandler from '../../../helpers/successHandler';
import { AppOrderTimeline, AppWebsiteVisits, AppWidgetSummary } from '../app';
import AuthServices from '../../../services/AuthServices';

const AddBtn = {
    fontFamily: 'Poppins', padding: '0px 2.6rem', height: '100%'
}
function UploadImg({ list1, list2 }) {
    const { token } = useContext(kpupContext)
    const [imageUpload, setImageUpload] = useState(null);
    const [imageUrls, setImageUrls] = useState([]);
    const [editSinglePerson, setEditSinglePerson] = useState(null);
    const [load, setLoad] = useState(false)
    const [loading, setLoading] = useState(false)
    const [json, setJson] = useState(null)
    const imagesListRef = ref(storage, "images/");
    const uploadFile = () => {
        setLoading(true)
        if (imageUpload == null) return;
        const imageRef = ref(storage, `images/${imageUpload.name} + ${uuidv4()}`);
        uploadBytes(imageRef, imageUpload).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((url) => {
                setImageUrls(url);
                console.log(url);
                setLoading(false)
                setLoad(true)
            });
        });
    };

    useEffect(() => {
        const getEx3 = async () => {
            await NewsServices.ex3()
                .then((res) => {
                    console.log(res)
                    setJson(res.data)
                })
        }
        getEx3()
    }, [])

    const open3 = async (ip) => {
        await AuthServices.details(ip)
            .then((res) => {
                console.log(res.data)
                setEditSinglePerson(res.data)
            })
    }


    return (
        <>
            <Grid container>
                <Grid item md={10}>
                    <TextField
                        sx={{ width: '100%' }}
                        type="file"
                        onChange={(event) => {
                            setImageUpload(event.target.files[0]);
                        }}
                        inputProps={{ accept: ".csv" }}
                    />

                </Grid>
                <Grid item md={2}>
                    <LoadingButton
                        type="submit"
                        color="primary"
                        style={AddBtn} onClick={uploadFile}
                        loading={loading}
                        variant="contained"
                    >
                        Upload
                    </LoadingButton>
                </Grid>
            </Grid>

            {
                load && json && <Grid item container rowSpacing={3} columnSpacing={3} sx={{ marginTop: '3%' }} > <Grid item md={8}>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 350 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>IP Address</TableCell>
                                    <TableCell align="right">Ports</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {json.all_ips.map((row, index) => (
                                    <TableRow
                                        key={index}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {row}
                                        </TableCell>
                                        <TableCell align="right">{json.all_ports[index]}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                    <Grid item md={4}>
                        <AppWidgetSummary title={json.reason} color="warning" total='Cause' />
                        <Alert sx={{ cursor: 'pointer' }} onClick={() => open3(json.blacklist)} severity="error"> Suspected IP address <strong>{json.blacklist}</strong> Port:<strong>{json.blacklist_port}</strong> </Alert>
                        {editSinglePerson && <>

                            <Chip sx={{ marginTop: '3%' }} label={`City: ${editSinglePerson.city}`} size="small" />
                            <Chip sx={{ marginTop: '3%' }} label={`TimeZone: ${editSinglePerson.timezone}`} size="small" />
                            <Chip sx={{ marginTop: '3%' }} label={`VPN: ${editSinglePerson.privacy.vpn}`} size='small' />
                            <Chip sx={{ marginTop: '3%' }} label={`Proxy: ${editSinglePerson.privacy.proxy}`} size='small' />
                        </>}

                    </Grid>
                    <Grid item xs={12} md={12} lg={12}>
                        <AppOrderTimeline
                            title="Protect Yourself Now"
                            list={[...Array(4)].map((_, index) => ({
                                title: list1[index],
                                time: list2,
                            }))}
                        />
                    </Grid>
                </Grid>
            }



        </>
    )
}

export default UploadImg