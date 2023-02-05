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
        const getInfectedHost = async () => {
            await NewsServices.infectedHost()
                .then((res) => {
                    console.log(res)
                    setJson(res.data)
                })
        }
        getInfectedHost()
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
                load && json && <Grid item container rowSpacing={3} columnSpacing={3} sx={{ marginTop: '3%' }} >
                    <Grid item md={12}>
                        <AppWidgetSummary title={json.reasons} color="warning" total='Cause' />
                        <Alert sx={{ cursor: 'pointer' }} severity="error">Blacklisted IP Addresses{
                            json.blacklist_ip.map((por) => {
                                return <strong> {por}, </strong>
                            })

                        }Port:<strong> {json.blacklist_port}</strong> </Alert>


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