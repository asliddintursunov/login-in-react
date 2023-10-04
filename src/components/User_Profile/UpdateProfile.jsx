// import './User_Profile.css'
import { useNavigate } from "react-router-dom"
import axios from "axios"
import styles from "../../css/EditProfile.module.css"
// Components
import Edit_FullName from "./part/Edit_FullName"
import Edit_UserName from "./part/Edit_UserName"
import Edit_Email from "./part/Edit_Email"
import Edit_Password from "./part/Edit_Password"
import Edit_Address from "./part/Edit_Address"
import Edit_DateOfBirth from "./part/Edit_DateOfBirth"
import Edit_UploadImage from "./part/Edit_UploadImage"
import AddPhoneNumber from "./part/AddPhoneNumber"
import LogOutModal from "./part/LogOutModal"
import _PopUp from "../_PopUp"
import Edit_Major from "./part/Edit_Major"
import Edit_Skills from "./part/Edit_Skills"
import Edit_Experience from "./part/Edit_Experience"
import Edit_Resume from "./part/Edit_Resume"

// Custon Hooks
import { useUsername } from "../../hooks/useUsername"
import { usePassword } from "../../hooks/usePassword"
import { useEmail } from "../../hooks/useEmail"
import { useCallback, useEffect, useState } from "react"
import useURL from "../../hooks/useURL"
import { baseUrl } from "../../utils/api"
import { googleLogout } from "@react-oauth/google"
import { useDispatch, useSelector } from "react-redux"
import { sendHeaders, logoutUser } from "../../features/userDataSlice"

function UpdateProfile() {
  // Redirect user to another page
  const navigate = useNavigate()

  const head = useSelector((state) => state.headers)
  const dispatch = useDispatch()

  // Custom URL hook
  const { defaultImage } = useURL()

  // Custom useUsername Hook
  const { usernameValue, setUsernameValue, validUsernameChecker, usernameFocus, setUsernameFocus, usernameTrue, setUsernameTrue, usernameChecker, usernameInputStyle } = useUsername()

  // Custom usePassword Hook
  const { passwordValue, setPasswordValue, validPasswordChecker, passwordTrue, setPasswordTrue, passwordType, setPasswordType, passwordChecker, passwordInputStyle } = usePassword()

  // Custom Email Hook
  const { emailValue, setEmailValue, validEmailChecker, emailFocus, setEmailFocus, emailTrue, setEmailtrue, emailChecker, emailInputStyle } = useEmail()

  // Full Name, Address, DateOfBirth values
  const [fullName, setFullName] = useState("")
  const [address, setAddress] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [data, set_data] = useState({})

  // Disable && Enable inputs
  const [changeProfile, setChangeProfile] = useState(false)

  // Add Phone Number
  const [numbers, setNumbers] = useState([])
  const [newNumber, setNewNumber] = useState("998")

  // Additional Values
  const [major, setMajor] = useState("")
  const [experience, setExperience] = useState("")
  const [skills, setSkills] = useState([])
  const [userResume, setUserResume] = useState(null)

  // Loader
  const [isPending, setIsPending] = useState(false)

  // Pop Up States
  const [isOpen, setIsOpen] = useState(false)
  const [popupInfo, setPopupInfo] = useState("")
  const [errorOccured, setErrorOccured] = useState("")

  useEffect(
    () => {
      dispatch(sendHeaders())
    }, []
  )

  // Token Expired Validation
  const tokenExpired = useCallback(
    (info) => {
      setIsOpen(true)
      setErrorOccured(true)
      setPopupInfo(info)
      setTimeout(() => {
        localStorage.removeItem("token")
        // localStorage.removeItem("accessToken")
        navigate("/signin")
      }, 1500)
    },
    [navigate]
  )

  const handleAddNewNumber = (e) => {
    e.preventDefault()
    setNumbers((prev) => [...prev, Number(newNumber)])

    setNewNumber("998")
  }

  const handleDelete = (number) => {
    setNumbers((prev) => {
      return prev.filter((num) => num !== number)
    })
  }

  // Change Profile Image === Working
  const [selectedImage, setSelectedImage] = useState(null)

  const handleImageChange = (event) => {
    const file = event.target.files[0]
    const reader = new FileReader()

    reader.onload = () => {
      const base64String = reader.result
      setSelectedImage(base64String)
    }
    if (file) {
      reader.readAsDataURL(file)
    }
  }

  const handleResumeChange = (event) => {
    const file = event.target.files[0]

    localStorage.setItem("fileName", file.name)

    const reader = new FileReader()

    reader.onload = () => {
      const base64String = reader.result
      setUserResume(base64String)
    }
    if (file) {
      reader.readAsDataURL(file)
    }
  }

  // Cancle Edition === Working
  const CancleEdition = useCallback(() => {
    setIsPending(true)
    axios
      .get(`${baseUrl}/user/${localStorage.getItem("userId")}`, {
        headers: head
      })
      .then((res) => {
        set_data(res.data)
        setFullName(res.data.fullname)
        setUsernameValue(res.data.username)
        setEmailValue(res.data.email)
        // setPasswordValue(res.data.password)
        setAddress(res.data.address)
        setDateOfBirth(res.data.date_birth)
        setSelectedImage(res.data.profile_photo)
        setUserResume(res.data.resume)
        setNumbers(res.data.phone_number)
        setMajor(res.data.major)
        setExperience(res.data.experience)
        setSkills(res.data.skills)
        setIsPending(false)
      })
      .catch((err) => {
        if (err.response.status === 401) {
          alert(err.response.data)
          dispatch(logoutUser())
        }
        if (err.response.data.msg) {
          tokenExpired(err.response.data.msg)
        }
        setIsPending(false)
      })
  }, [setFullName, setUsernameValue, setEmailValue, setAddress, setDateOfBirth, setSelectedImage, tokenExpired])

  useEffect(() => {
    CancleEdition()
  }, [CancleEdition])

  // Save Edition === Working
  const saveEdition = useCallback(() => {
    axios
      .patch(`${baseUrl}/update_profile/${localStorage.getItem("userId")}`, {
        fullname: data.fullname !== fullName ? fullName : undefined,
        // username: data.username !== usernameValue ? usernameValue : undefined,
        username: usernameValue,
        email: data.email !== emailValue ? emailValue : undefined,
        password: passwordValue !== "" ? passwordValue : undefined,
        address: data.address !== address ? address : undefined,
        date_birth: data.date_birth !== dateOfBirth ? dateOfBirth : undefined,
        phone_number: data.phone_number !== numbers ? numbers : undefined,
        profile_photo: data.profile_photo !== selectedImage ? selectedImage : undefined,
        resume: data.resume !== userResume ? userResume : undefined,
        major: data.major !== major ? major : undefined,
        experience: data.experience !== experience ? experience : undefined,
        skills: data.skills !== skills ? skills : undefined
      }, {
        headers: head
      })
      .then((res) => {
        setIsOpen(true)
        setPopupInfo(res.data)
        setErrorOccured(false)
      })
      .catch((err) => {
        if (err.response.status === 401) {
          alert(err.response.data)
          dispatch(logoutUser())
        }

        setIsOpen(true)
        if (err.response.data.msg) {
          tokenExpired(err.response.data.msg)
        } else {
          setErrorOccured(true)
          setPopupInfo(err.response.data)
        }
      })
  }, [fullName, usernameValue, emailValue, passwordValue, address, dateOfBirth, selectedImage, numbers, data, tokenExpired, major, experience, skills, userResume])

  // Log Out === Working
  const logOut = () => {
    googleLogout()
    axios
      .get(`${baseUrl}/logout/${localStorage.getItem('userId')}`, {
        headers: head
      })
      .then((res) => {
        console.log(res)

        setIsOpen(true)

        setErrorOccured(false)
        setPopupInfo(res.data)

        setTimeout(() => {
          navigate("/signin")
        }, 1500)
        localStorage.removeItem("token")
        // localStorage.removeItem("accessToken")
        localStorage.removeItem("userRole")
        localStorage.removeItem("userId")
      })
      .catch((err) => {
        if (err.response.status === 401) {
          alert(err.response.data)
          dispatch(logoutUser())
        }
        console.log(err);
        setIsOpen(true)
        if (err.response.data.msg) {
          tokenExpired(err.response.data.msg)
        }
      })
  }
  const [showModal, setShowModal] = useState(false)
  const toggleModal = () => setShowModal(!showModal)

  // =========== Additional Skills ==========
  const seeSkills = (value) => {
    if (skills.includes(value)) {
      setSkills((prev) => prev.filter((skill) => skill !== value))
    } else {
      setSkills((prev) => [...prev, value])
    }
  }

  // For Major
  const seeMajor = (value) => {
    setMajor(value)
  }

  // For Experience
  const seeExperience = (value) => {
    setExperience(value)
  }

  // ###########################################################333
  return (
    <div className={`container ${styles.userProfileContainer} pageAnimation`}>
      <br />
      {isOpen && <_PopUp errorOccured={errorOccured} popupInfo={popupInfo} setIsOpen={setIsOpen} />}
      {showModal && <LogOutModal toggleModal={toggleModal} logOut={logOut} />}
      {isPending && <div className="loaderr"></div>}
      {!isPending && (
        <div style={{ filter: showModal ? "blur(4px)" : "blur(0)" }}>
          {/* Header, Image ... */}
          <div className={styles.profileUpdateHeader}>
            <h2>My Profile</h2>
            <div>
              <i className="bi bi-bell-fill"></i>
              {selectedImage ? <img src={selectedImage} /> : <img src={defaultImage} />}
            </div>
          </div>

          <hr />

          {/* ============ Update Profile Form ============ */}
          <br />
          <form action="/update_profile/" method="post" encType="multipart/form-data" onSubmit={(e) => e.preventDefault()} className={`form-control ${styles.updateProfileForm}`}>
            <div className={`${styles.topData} `}>
              <div className={`${styles.topLeftData}`}>
                <Edit_UploadImage selectedImage={selectedImage} handleImageChange={handleImageChange} changeProfile={changeProfile} />
                <div className={styles.additionalInfo}>
                  <Edit_Major major={major} seeMajor={seeMajor} changeProfile={changeProfile} />
                  <Edit_Experience experience={experience} seeExperience={seeExperience} changeProfile={changeProfile} />
                </div>
              </div>
              <div className={`${styles.topRightData}`}>
                <Edit_FullName changeProfile={changeProfile} fullName={fullName} setFullName={setFullName} />
                <Edit_UserName
                  usernameValue={usernameValue}
                  setUsernameValue={setUsernameValue}
                  validUsernameChecker={validUsernameChecker}
                  usernameFocus={usernameFocus}
                  setUsernameFocus={setUsernameFocus}
                  usernameTrue={usernameTrue}
                  setUsernameTrue={setUsernameTrue}
                  usernameChecker={usernameChecker}
                  usernameInputStyle={usernameInputStyle}
                  changeProfile={changeProfile}
                />
                <Edit_Email
                  emailValue={emailValue}
                  setEmailValue={setEmailValue}
                  validEmailChecker={validEmailChecker}
                  emailFocus={emailFocus}
                  setEmailFocus={setEmailFocus}
                  emailTrue={emailTrue}
                  setEmailtrue={setEmailtrue}
                  emailChecker={emailChecker}
                  emailInputStyle={emailInputStyle}
                  changeProfile={changeProfile}
                />
                <Edit_Password
                  passwordValue={passwordValue}
                  setPasswordValue={setPasswordValue}
                  validPasswordChecker={validPasswordChecker}
                  passwordTrue={passwordTrue}
                  setPasswordTrue={setPasswordTrue}
                  passwordType={passwordType}
                  setPasswordType={setPasswordType}
                  passwordChecker={passwordChecker}
                  passwordInputStyle={passwordInputStyle}
                  changeProfile={changeProfile}
                />
                <Edit_Address changeProfile={changeProfile} address={address} setAddress={setAddress} />
                <Edit_DateOfBirth changeProfile={changeProfile} dateOfBirth={dateOfBirth} setDateOfBirth={setDateOfBirth} />
              </div>
            </div>
            <div className={`${styles.middleData}`}>
              <Edit_Skills changeProfile={changeProfile} skills={skills} setSkills={setSkills} seeSkills={seeSkills} />
            </div>
            <div className={`${styles.bottomData}`}>
              <div className={`${styles.bottomLeftData}`}>
                <AddPhoneNumber numbers={numbers} newNumber={newNumber} setNewNumber={setNewNumber} handleAddNewNumber={handleAddNewNumber} handleDelete={handleDelete} changeProfile={changeProfile} />
              </div>
              <div className={`${styles.bottomRightData} bg-light`}>
                <Edit_Resume handleResumeChange={handleResumeChange} changeProfile={changeProfile} />
              </div>
            </div>
            <div className={styles.btnStyles}>
              <button className={`btn ${styles.logOutBtn}`} onClick={() => toggleModal()}>
                <i className="bi bi-box-arrow-right"></i> Log Out
              </button>
              {!changeProfile && (
                <button className={`btn ${styles.editBtn}`} onClick={() => setChangeProfile(true)}>
                  Edit Profile
                </button>
              )}
              {changeProfile && (
                <button
                  className={`btn ${styles.saveBtn}`}
                  onClick={() => {
                    setChangeProfile(false)
                    saveEdition()
                  }}
                >
                  Save Changes
                </button>
              )}
              {changeProfile && (
                <button
                  className={`btn ${styles.cancelBtn}`}
                  onClick={() => {
                    setChangeProfile(false)
                    CancleEdition()
                  }}
                >
                  Cancel Edition
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
export default UpdateProfile
