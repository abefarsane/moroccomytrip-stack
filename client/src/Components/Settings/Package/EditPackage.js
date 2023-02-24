import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ModalCustom from '../../ModalCustom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faInfoCircle, faCheck, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import Autocomplete from "react-google-autocomplete";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/esm/Container';
import { AuthContext } from '../../../Tools/Context/AuthContext'


export default function EditPackage() {
    const [imageUrl, setImageUrl] = useState("")
    const [fullscreen, setFullscreen] = useState(true);
    const [show, setShow] = useState(false);
    const [packDetails, setPackDetails] = useState({
        package: {},
        services: {
            included: [],
            notIncluded: []
        }
    })

    const { api } = useContext(AuthContext)

    const [packId, setPackId] = useState()

    useEffect(() => {
        setSuccess("")
        setErrMsg("")
    }, [fullscreen])
    
    const [showEdit, setShowEdit] = useState(false)

    function handleShow(breakpoint) {
        setFullscreen('sm');
        setShow(true);
    }

    function handleShowEdit(breakpoint, pack) {
        setFullscreen('lg');
        setShowEdit(true)
        getPackageServices(pack)
        setPackId(pack.id)
        editPackageSetter(pack)
        getPackageImage(pack.id)
        console.log(imageUrl)
    }


    const getPackageImage = (id) => {
        axios.get(`${api}/packages/package-image/${id}`)
            .then((response) => {
                setImageUrl(response.data)
            })
    }


    function editPackageSetter(pack) {
        setTitle(pack.title)
        setDescription(pack.description)
        setLocation(pack.location)
        setPrice(pack.price)
        setDays(pack.duration)
        setPeople(pack.people)
    }

    const [serviceToAdd, setServiceToAdd] = useState("")

    function handleDeleteService(id) {
        console.log('pup')

        axios.delete(`${api}/services/${id}`)
            .then((response) => {
                if(response.data.status) {
                    axios.get(`${api}/services/pack-services/${packId}`)
                        .then((response) => {
                            const services = response.data.services
                            let included = setServices(services, true)
                            let notIncluded = setServices(services, false)
                            setPackDetails({
                                package: packDetails.package,
                                services: {
                                    included: included
                                    ,
                                    notIncluded: notIncluded
                                }
                            })
                        })
                    console.log('Done')
                    
                }
            })

    }




    let included = []
    let notIncluded = []


    const [responseJSON, setResponseJSON] = useState([])
    let navigate = useNavigate()

    const [errMsg, setErrMsg] = useState('')
    const [nOfErr, setNofErr] = useState(0)
    const [toCheck, setToCheck] = useState("")

    const [success, setSuccess] = useState('')

    const [title, setTitle] = useState('')
    const [titleFocus, setTitleFocus] = useState(false)
    const [validTitle, setValidTitle] = useState(false)
    const TITLE_REGEX = /^[A-Za-z][A-Za-z ]{9,31}$/

    const [description, setDescription] = useState('')
    const [descriptionFocus, setDescriptionFocus] = useState(false)
    const [validDescription, setValidDescription] = useState(false)
    const DESCRIPTION_REGEX = /^[A-Za-z][A-Za-z_\b ].{40,4000}$/

    const [location, setLocation] = useState('')
    const [locationFocus, setLocationFocus] = useState(false)
    const [validLocation, setValidLocation] = useState(false)
    const LOCATION_REGEX = /^[A-Za-z ]{4,16}$/

    const [price, setPrice] = useState(0)
    const [priceFocus, setPriceFocus] = useState(false)

    const [days, setDays] = useState(1)
    const [daysFocus, setDaysFocus] = useState(false)

    const [people, setPeople] = useState(1)
    const [peopleFocus, setPeopleFocus] = useState(false)

    let i = 0


    const [includedService, setIncludedService] = useState([{ service: "" }]);
    const [notIncludedService, setnotIncludedService] = useState([{ service: "" }]);

    const [apiKey, setApiKey] = useState("")

    const [image, setImage] = useState({ preview: '', data: '' })
    const [status, setStatus] = useState('')



    const handleServiceChange = (e, index) => {
      const { name, value } = e.target;
      const list = [...includedService];
      list[index][name] = value;
      setIncludedService(list);
    };

    const handleServiceRemove = (index) => {
      const list = [...includedService];
      list.splice(index, 1);
      setIncludedService(list);
    };

    const handleServiceAdd = () => {
      setIncludedService([...includedService, { service: "" }]);
    };



    const handlenotIncludedServiceChange = (e, index) => {
      const { name, value } = e.target;
      const list = [...notIncludedService];
      list[index][name] = value;
      setnotIncludedService(list);
    };

    const handlenotIncludedServiceRemove = (index) => {
      const list = [...notIncludedService];
      list.splice(index, 1);
      setnotIncludedService(list);
    };

    const handlenotIncludedServiceAdd = () => {
      setnotIncludedService([...notIncludedService, { service: "" }]);
    };


    //const [daysInfo, setDaysInfo] = useState({})
    let points = []


    //CHECK TITLE REGEX
    useEffect(() => {
        setValidTitle(TITLE_REGEX.test(title));
    }, [title])

    //CHECK DESCRIPTION REGEX
    useEffect(() => {
        setValidDescription(DESCRIPTION_REGEX.test(description));
        console.log(validDescription)
    }, [description])

    //CHECK FORM ERRORS AND SET THEM
    useEffect(() => {
        setErrMsg('')
    }, [])

    const updatePage = () => {
        axios.get(`${api}/packages/all`)
        .then((response) => {
                if (response.data.status) {
                    setResponseJSON(response.data.packages)
                } else {
                    setResponseJSON(response.data.packages)
                }

           
        })
    }

    useEffect(() => {
        updatePage()
    }, [])




    const createNewPackage = (e) => {
        e.preventDefault()
        
        if(!title || !description || !price || !location || !image.data) {
            setSuccess('')
            setErrMsg('Check and fill all the input fields.')
        } else if (!validTitle || !validDescription){
            setSuccess('')
            setErrMsg('Correct the errors and follow the guidelines.')
        } else {

            var idComponent = ""
            var nOfLetters = 2
            while (nOfLetters != 0) {
                nOfLetters -= 1
                idComponent += title[Math.floor(Math.random() * title.length)];
            } 

            var id = idComponent + Math.random().toString(16).slice(2)

            
            
            const newPackage = {
                id: id,
                location: location,
                price: price, 
                description: description,
                title: title,
                people: people,
                services: {
                    included: includedService,
                    notIncluded: notIncludedService
                },
                duration: days
            }

            /*  */
            setErrMsg('')

            //handleImgUploadRequest()

            axios.post(`${api}/packages/new`, newPackage, {
                headers: { token: localStorage.getItem('token')}
            })
            .then((response) => {
                if (response.data.error) {
                    setSuccess('')
                    setErrMsg(response.data.error)
                    navigate('/login')
                } else if(response.data.status) {
                    console.log(response.data.packageId)
                    handleImgUploadRequest(response.data.packageId)
                    setSuccess(response.data.message)
                    updatePage()
                }
                
            })
            
        }
        
    }

    const editPackage = (e) => {

        e.preventDefault()

        if(!title || !description || !price || !location ) {
            setSuccess('')
            setErrMsg('Check and fill all the input fields.')
        } else if (!validTitle || !validDescription){
            setSuccess('')
            setErrMsg('Correct the errors and follow the guidelines.')
        } else {
            const updatedPackage = {
                location: location,
                price: price, 
                description: description,
                title: title,
                people: people,
                duration: days
            }

              
            setErrMsg('')
            axios.post(`${api}/packages/update/${packId}`, updatedPackage, {
                headers: { token: localStorage.getItem('token')}
            })
            .then((response) => {

                if (response.data.error) {
                    console.log(response.data.error)
                    navigate('/login')
                } else {
                    updatePage()
                    setShowEdit(false)
                }
                
                
            })
            
            
        }
        
    }

    const handleAddServiceRequest = (type) => {
        if (serviceToAdd.length == 0) {
            console.log('Fill service field to add a new one!')
        } else {
            const service = {
                serviceBody: serviceToAdd,
                PackageId: packDetails.package.id,
                included: type
            }
            axios.post(`${api}/services/addToPackage`, service, {
                headers: { token: localStorage.getItem('token')}
            })
                .then((response) => {
                    if (response.data.status) {
                        console.log('Added!')
                        setServiceToAdd("")
                        getPackageServices(packDetails.package)
                    } else {
                        setErrMsg(response.error)
                        navigate('/login')
                    }
                })
        }
    }
    const setServices = (services, type) => {

        if (type) {
            let array = []
            services.map(p => {
                p.included && array.push({
                    id: p.id,
                    serviceBody: p.serviceBody
                })
            })
            return array
        } else {
            let array = []
            services.map(p => {
                !p.included && array.push({
                    id: p.id,
                    serviceBody: p.serviceBody
                })
            })
            return array
        }
        
    }
    const getPackageServices = (pack) => {
        axios.get(`${api}/services/pack-services/${pack.id}`)
            .then((response) => {
                const services = response.data.services
                included = setServices(services, true)
                notIncluded = setServices(services, false)
                setPackDetails({
                    package: pack,
                    services: {
                        included: included
                        ,
                        notIncluded: notIncluded
                    }
                })
            })
    }
    const handlePackageDelete = () => {
        axios.delete(`${api}/packages/${packId}`)
            .then(() => {
                setShowEdit(false)
                updatePage()
            })
    }
    const handleImgUploadRequest = async (packageId) => {
        let formData = new FormData()

        formData.append('file', image.data)

        await axios.post(`${api}/packages/upload/package-img`, formData, {
            headers: { token: localStorage.getItem('token')}
        })
            .then((response) => {
                console.log(response.data)
                //setStatus(response.data.statusText)
            })
    }
    const handleFileChange = (e) => {
        const img = {
          preview: URL.createObjectURL(e.target.files[0]),
          data: e.target.files[0]
        }
        setImage(img)
    }

    

    


    

    return (
        <div className='edit-package animate__animated animate__fadeIn' >
            <section className='manage-package-head'>
                <h4 className='h5-response'>Manage your packages</h4>

                <button className='btn-secondary' onClick={() => handleShow(true)}>+</button> 

                <Modal show={show} fullscreen={fullscreen} onHide={() => setShow(false)}>
                  <Modal.Header closeButton>
                    <Modal.Title><h1 id='modal-title'>Add a new package</h1><p id={errMsg ? 'errmsg' : 'offscreen'} aria-live="assertive">{errMsg}</p>
                    <p id={success ? 'successmsg' : 'offscreen'} aria-live="assertive">{success}</p></Modal.Title>
                  </Modal.Header>
                  <Container>
                  <Modal.Body>
                    
                    <section className='img-pack'>
                        {
                            image.preview && <img src={image.preview}  />
                        }
                        <hr></hr>
                            <input type='file' name='file' onChange={handleFileChange}></input>
                        {status && <h4>{status}</h4>}
                    </section>

                    <form id='new-package-form' onSubmit={createNewPackage}>
                <section id='titleSection'>
                    <p id='modal-lbl'>Title
                        <FontAwesomeIcon icon={faCheck} className={validTitle ? "valid" : "hide"} />
                        <FontAwesomeIcon icon={faTimes} className={!validTitle ? "invalid" : "hide"} />
                    </p>
                    <input
                    type='text'
                    className='input-text'
                    onChange={(e) => {
                        setTitle(e.target.value)
                    }}
                    id='input'
                    onFocus={() => setTitleFocus(true)}
                    onBlur={() => setTitleFocus(false)}

                    ></input>
                    <p id="emConfNote" className={!validTitle   ? "instructions" : "offscreen"}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    Minimum of 10 characters and maximum of 30. <br></br>Must start with a letter and does not accept special characters.
                    </p>
                </section>

                <section id='descrSection'>
                    <p id='modal-lbl'>
                        Description
                        <FontAwesomeIcon icon={faCheck} className={validDescription ? "valid" : "hide"} />
                        <FontAwesomeIcon icon={faTimes} className={!validDescription ? "invalid" : "hide"} />
                    </p>
                    <textarea
                    rows="4"
                    cols="50"
                    type='text'
                    onChange={(e) => {
                        setDescription(e.target.value)
                    }}
                    id='descr-textarea'
                    className='input-text'
                    onFocus={() => setDescriptionFocus(true)}
                    onBlur={() => setDescriptionFocus(false)}

                    ></textarea>
                    <p id="emConfNote" className={!validDescription   ? "instructions" : "offscreen"}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    Minimum of 30 characters and maximum of 130. <br></br>Must start with a letter and does not accept special characters.
                    </p>
                </section>

                <section id='locationSection'>
                    <p id='modal-lbl'>Location</p>

                        <input
                            className='input-text'
                            onChange={(e) => {
                                setLocation(e.target.value)
                            }}
                        />
                    </section>
                
                <div className='price-days-people'>
                    <section>
                        <p id='modal-lbl'>Price</p>

                        <input
                        className='input-text'
                        min='0'
                        text='0'
                        type='number'
                        onChange={(e) => {
                            setPrice(e.target.value)
                        }}
                        id='input'
                        onFocus={() => setPriceFocus(true)}
                        onBlur={() => setPriceFocus(false)}

                        ></input>
                        </section>

                        <section>
                        <p id='modal-lbl'>Days</p>

                        <input
                        min='1'
                        className='input-text'
                        max='7'
                        text='0'
                        type='number'
                        onChange={(e) => {
                            Number(e.target.value) > 7 || setDays(Number(e.target.value))
                        }}
                        id='input'
                        onFocus={() => setDaysFocus(true)}
                        onBlur={() => setDaysFocus(false)}

                        ></input>
                    </section>

                    

                <section id='number-people'>
                    <p id='modal-lbl'>People</p>

                    <input
                    min='1'
                    className='input-text'
                    max='7'
                    text='0'
                    type='number'
                    onChange={(e) => {
                        Number(e.target.value) > 7 || setPeople(Number(e.target.value))
                    }}
                    id='input'
                    onFocus={() => setPeopleFocus(true)}
                    onBlur={() => setPeopleFocus(false)}

                    ></input>
                </section>

                </div>

                <div className='services'>         
                    <hr></hr>
                    <div className='list-services'>
                    <p id='modal-lbl'>Services included</p>
                         {includedService.map((singleService, index) => (
                            <div key={index} className='services'>
                                <div className='service-box'>
                                    <p id='modal-lbl'>{index + 1}</p>
                                        <input
                                            name='service'
                                            type='text'
                                            className='input-text'
                                            value={includedService.description}
                                            onChange={(e) => handleServiceChange(e, index)}
                                            required
                                        />
                                        {includedService.length !== 1 && (
                                                  <button
                                                    type="button"
                                                    onClick={() => handleServiceRemove(index)}
                                                    className="remove-btn"
                                                    id='remove-btn'
                                                  >
                                                    <strong>-</strong>
                                                  </button>
                                                )}
                                </div>
                                <div className='add-btn-div'>
                                    {includedService.length - 1 === index && includedService.length < 6 && (
                                            <button
                                                type='button'
                                                onClick={handleServiceAdd}
                                                className='add-btn'
                                                id='add-btn'
                                                >
                                                <span>Add</span>
                                            </button>
                                        )}
                                </div>
                                
                            </div>
                            
                            
                         ))}
                    </div>     
                                <hr></hr>
                    
                    <div className='list-services'>
                    <p id='modal-lbl'>Services not included</p>  
                         {notIncludedService.map((singleService, index) => (
                            <div key={index} className='services'>
                                <div className='service-box'>
                                <p id='modal-lbl'>{index + 1}</p>
                                        <input
                                            name='service'
                                            type='text'
                                            className='input-text'
                                            value={notIncludedService.description}
                                            onChange={(e) => handlenotIncludedServiceChange(e, index)}
                                            required
                                        />
                                        {notIncludedService.length !== 1 && (
                                                  <button
                                                    type="button"
                                                    onClick={() => handlenotIncludedServiceRemove(index)}
                                                    className="remove-btn"
                                                    id='remove-btn'
                                                  >
                                                    <span>-</span>
                                                  </button>
                                                )}
                                    
                                </div>
                                {notIncludedService.length - 1 === index && notIncludedService.length < 6 && (
                                            <button
                                                type='button'
                                                onClick={handlenotIncludedServiceAdd}
                                                className='add-btn'
                                                id='add-btn'
                                                >
                                                <span>+</span>
                                            </button>
                                        )}
                            </div>
                            
                            
                         ))}
                    </div>
                </div>
                
                

                <button className='btn-secondary'>Add packge</button>
            </form>
                  </Modal.Body>
                  </Container>
                </Modal>
            </section>


            <section className='edit-package'>
                <Modal show={showEdit} fullscreen={fullscreen} onHide={() => setShowEdit(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <h1>Edit package</h1>
                    </Modal.Title>
                  </Modal.Header>
                    <section className='delete-package-section' onClick={() => handlePackageDelete()}>
                            DELETE
                    </section>
                  <Container>

                    <Modal.Body>
                    <p id={errMsg ? 'errmsg' : 'offscreen'} aria-live="assertive">{errMsg}</p>
                        <p id={success ? 'successmsg' : 'offscreen'} aria-live="assertive">{success}</p>

                    <section className='img-pack'>
                        <img src={imageUrl}  />
                    </section>
                    <section className='img-upload'>
                        {
                            image.preview && <img src={image.preview} width='100' height='100' />
                        }
                        <hr></hr>
                            <input id='file-upload-btn' type='file' name='file' onChange={handleFileChange}></input>
                        {status && <h4>{status}</h4>}
                    </section>
                    <form onSubmit={editPackage}>
                        <section id='titleSection'>
                            <p id='modal-lbl'>Title
                                <FontAwesomeIcon icon={faCheck} className={validTitle ? "valid" : "hide"} />
                                <FontAwesomeIcon icon={faTimes} className={!validTitle ? "invalid" : "hide"} />
                            </p>
                            <input
                            type='text'
                            className='input-text'
                            onChange={(e) => {
                                setTitle(e.target.value)
                            }}
                            value={title}
                            id='input'
                            onFocus={() => setTitleFocus(true)}
                            onBlur={() => setTitleFocus(false)}
                            ></input>
                            <p id="emConfNote" className={"instructions"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Minimum of 10 characters and maximum of 30. <br></br>Must start with a letter and does not accept special characters.
                            </p>
                        </section>

                        <section id='descrSection'>
                        <p id='modal-lbl'>
                        Description
                        <FontAwesomeIcon icon={faCheck} className={validDescription ? "valid" : "hide"} />
                        <FontAwesomeIcon icon={faTimes} className={!validDescription ? "invalid" : "hide"} />
                    </p>
                            <textarea
                            rows="4"
                            
                            cols="50"
                            type='text'
                            onChange={(e) => {
                                setDescription(e.target.value)
                            }}
                            value={description}
                            id='descr-textarea'
                            className='input-text'
                            onFocus={() => setDescriptionFocus(true)}
                            onBlur={() => setDescriptionFocus(false)}
                            ></textarea>
                            <p id="emConfNote" className={"instructions"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Minimum of 30 characters and maximum of 130. <br></br>Must start with a letter and does not accept special characters.
                            </p>
                        </section>

                        <section id='locationSection'>
                            <p id='modal-lbl'>Location</p>
                                <input
                                    className='input-text'
                                    onChange={(e) => {
                                        setLocation(e.target.value)
                                    }}
                                    value={location}
                                    placeholder={packDetails.package.location}
                                />
                        </section>

                        <div className='price-days-people'>
                    <section>
                        <p id='modal-lbl'>Price</p>

                        <input
                        className='input-text'
                        min='0'
                        text='0'
                        type='number'
                        value={price}
                        onChange={(e) => {
                            setPrice(e.target.value)
                        }}
                        id='input'
                        onFocus={() => setPriceFocus(true)}
                        onBlur={() => setPriceFocus(false)}
                        placeholder={packDetails.package.price}
                        ></input>
                        </section>

                        <section>
                        <p id='modal-lbl'>Days</p>

                        <input
                        min='1'
                        className='input-text'
                        max='7'
                        text='0'
                        type='number'
                        value={days}
                        onChange={(e) => {
                            Number(e.target.value) > 7 || setDays(Number(e.target.value))
                        }}
                        placeholder={packDetails.package.duration}
                        id='input'
                        onFocus={() => setDaysFocus(true)}
                        onBlur={() => setDaysFocus(false)}

                        ></input>
                    </section>

                    

                <section id='number-people'>
                    <p id='modal-lbl'>People</p>

                    <input
                    min='1'
                    className='input-text'
                    max='7'
                    text='0'
                    type='number'
                    value={people}
                    onChange={(e) => {
                        Number(e.target.value) > 7 || setPeople(Number(e.target.value))
                    }}
                    id='input'
                    onFocus={() => setPeopleFocus(true)}
                    onBlur={() => setPeopleFocus(false)}
                    placeholder={packDetails.package.people}
                    ></input>
                </section>

                </div>

                <div className='services'>         

                    <div className='list-services'>
                        <section className='header'>
                            <p id='modal-lbl'>Services included</p>
                            <section className='add-service'>
                                
                            </section>
                        </section>

                       
                        {
                            packDetails.services.included.map((s, key) => {
                                return (
                                    <section className='service-item'>
                                        <p>{s.serviceBody}</p>
                                        <section onClick={() => handleDeleteService(s.id)}>
                                            <FontAwesomeIcon icon={faTrash} />
                                        </section>                                      
                                    </section>
                                )
                            })
                        }

                        {
                            packDetails.services.included.length < 5 && (
                                <section className='service-item'>
                                    <input
                                        type='text'
                                        placeholder='New service'
                                        onChange={(e) => {
                                            setServiceToAdd(e.target.value)
                                        }}
                                        id='service-add-input'
                                    />
                                    <section className='add-service' onClick={() => 
                                            handleAddServiceRequest(true)}>
                                        <FontAwesomeIcon icon={faPlus} />
                                    </section>   
                                </section>
                            )
                        }

                        
                        
                    </div>     
                                
                   
                    <div className='list-services'>
                    <section className='header'>
                            <p id='modal-lbl'>Services not included</p>
                            <section className='add-service'>
                                
                            </section>
                        </section>
                       
                        {
                            packDetails.services.notIncluded.map((s, key) => {
                                return (
                                    <section className='service-item'>
                                        <p>{s.serviceBody}</p>
                                        <section onClick={() => handleDeleteService(s.id)}>
                                            <FontAwesomeIcon icon={faTrash} />
                                        </section>                                      
                                    </section>
                                )
                            })
                        }

                    {
                            packDetails.services.included.length < 5 && (
                                <section className='service-item'>
                                    <input
                                        type='text'
                                        placeholder='New service'
                                        onChange={(e) => {
                                            setServiceToAdd(e.target.value)
                                        }}
                                        id='service-add-input'
                                    />
                                    <section className='add-service' onClick={() =>
                                            handleAddServiceRequest(false)
                            }>
                                        <FontAwesomeIcon icon={faPlus} />
                                    </section>   
                                </section>
                            )
                        }
                        
                    </div>   
                </div>
                <button className='btn-secondary'>Update package</button>
            </form>
                    </Modal.Body>
                  </Container>
                </Modal>
            </section>

            <section className='list-packages animate__animated animate__fadeIn'>
                <section className='list-title'>
                    <p>Title</p>
                    <p>Location</p>
                    <p>Days</p>
                </section>
                <hr></hr>
                {
                responseJSON.length > 0 ? responseJSON.map((pack, key) => 
                     ( 
                        
                        <section key={key} className='list-item animate__animated animate__fadeIn' onClick={() => handleShowEdit(true, pack)}>
                            <p>{pack.title}</p>
                            <p>{pack.location}</p>
                            <p>{pack.duration}</p>
                        </section>
                    )
                )
                     : <h2>No packages available.</h2> 
                }
            </section>
            
        </div>
    )
}