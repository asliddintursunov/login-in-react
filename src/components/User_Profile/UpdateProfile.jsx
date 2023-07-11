import './User_Profile.css'

// Components
import Edit_FullName from './part/Edit_FullName'
import Edit_UserName from './part/Edit_UserName'
import Edit_Email from './part/Edit_Email'
import Edit_Password from './part/Edit_Password'
import Edit_Address from './part/Edit_Address'
import Edit_DateOfBirth from './part/Edit_DateOfBirth'
import Edit_UploadImage from './part/Edit_UploadImage'
import AddPhoneNumber from './part/AddPhoneNumber'
import LogOutModal from './part/LogOutModal'

// Custon Hooks
import { useUsername } from '../../hooks/useUsername'
import { usePassword } from '../../hooks/usePassword'
import { useEmail } from '../../hooks/useEmail'
import { useCallback, useEffect, useRef, useState } from 'react'
import axios from 'axios'


function UpdateProfile() {
  // Custom useUsername Hook 
  const { usernameValue, setUsernameValue, validUsernameChecker, usernameFocus, setUsernameFocus,
    usernameTrue, setUsernameTrue, usernameChecker, usernameInputStyle } = useUsername()

  // Custom usePassword Hook
  const { passwordValue, setPasswordValue, validPasswordChecker,
    passwordTrue, setPasswordTrue,
    passwordType, setPasswordType, passwordChecker,
    passwordInputStyle } = usePassword()

  // Custom Email Hook
  const { emailValue, setEmailValue, validEmailChecker,
    emailFocus, setEmailFocus, emailTrue, setEmailtrue, emailChecker, emailInputStyle } = useEmail()
  // Full Name, Address, DateOfBirth values
  const [fullName, setFullName] = useState('')
  const [address, setAddress] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  // Disable && Enable inputs
  const [changeProfile, setChangeProfile] = useState(false)

  // Add Phone Number 
  const [numbers, setNumbers] = useState([])
  const [newNumber, setNewNumber] = useState('998')



  var phoneNumbersArray = null
  var numToString = null
  const handleAddNewNumber = (e) => {
    e.preventDefault();
    setNumbers(prev => [...prev, { id: numbers.length + 1, number: newNumber }])

    phoneNumbersArray = numbers.map(function (phoneNumber) {
      return phoneNumber.number
    })
    numToString = phoneNumbersArray.toString()
    console.log(numToString);

    setNewNumber('998')
    // console.log(numbers);
  }

  const handleDelete = (id) => {
    setNumbers(prev => {
      return prev.filter(e => e.id !== id)
    })
  }

  // Change Profile Image === Working
  const [selectedImage, setSelectedImage] = useState(null)

  const handleImageChange = (file) => {
    console.log(file);
    setSelectedImage(file)
  }
  // Cancle Edition === Working
  const CancleEdition = useCallback(() => {
    axios.get(`http://192.168.3.140:1000/users/${localStorage.getItem('userId')}`)
      .then(res => {
        // console.log(res);
        // User Data for input field
        setFullName(res.data.fullname)
        setUsernameValue(res.data.username)
        setEmailValue(res.data.email)
        // setPasswordValue(res.data.password)
        setAddress(res.data.address)
        setDateOfBirth(res.data.birth_date)
        // setSelectedImage(URL.createObjectURL(res.data.profile_photo))
      })
      .catch(err => console.error(err))
  }, [setFullName, setUsernameValue, setEmailValue, setAddress, setDateOfBirth])
  useEffect(() => { CancleEdition() }, [CancleEdition])


  // Save Edition === Working
  const saveEdition = () => {

    if (passwordValue.length >= 1) {
      axios.patch(`http://192.168.3.140:1000/update_profile/${localStorage.getItem('userId')}`, {
        fullname: fullName,
        username: usernameValue,
        email: emailValue,
        password: passwordValue,
        address: address,
        date_birth: dateOfBirth,
        // phone_number: numbers,
        phone_number: numToString,
        // profile_photo: URL.createObjectURL(selectedImage),
      })
        .then((res) => (res.data))
        .catch((err) => alert(err.response.data))
    }
    if (passwordValue.length == 0) {
      axios.patch(`http://192.168.3.140:1000/update_profile/${localStorage.getItem('userId')}`, {
        fullname: fullName,
        username: usernameValue,
        email: emailValue,
        // password: passwordValue,
        address: address,
        date_birth: dateOfBirth,
        // phone_number: numbers,
        phone_number: numToString,
        // profile_photo: URL.createObjectURL(selectedImage),
      })
        .then((res) => alert(res.data))
        .catch((err) => alert(err.response.data))
    }
  }
  // console.log(URL.createObjectURL(selectedImage));

  // Log Out === Working
  const logOut = () => {
    axios.delete(`http://192.168.3.140:1000/users/${localStorage.getItem('userId')}`)
      .then(() => alert('Successfully logged out!'))
      .catch(() => alert('Error occured, try later!'))
  }
  const [showModal, setShowModal] = useState(false)
  const toggleModal = () => setShowModal(!showModal)



  // dayTillBirthday()

  // ###########################################################333
  return (
    <div className='container'>
      {showModal && <LogOutModal toggleModal={toggleModal} logOut={logOut} />}
      <div style={{ filter: showModal ? 'blur(4px)' : 'blur(0)' }}>
        {/* Header, Image ... */}
        <div className='d-flex align-items-center justify-content-between'>
          <h1>My Profile</h1>
          <div className="d-flex align-items-center justify-content-center top-right-image">
            <p style={{ marginRight: '1rem' }}>{fullName}</p>
            {selectedImage ? <img src={URL.createObjectURL(selectedImage)} /> : <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQI3vvVZ-pOGsyhaNEm9s-tm96lh7OGxJrpPQ&usqp=CAU" />}
          </div>
        </div>
        <div style={{ marginTop: '1rem' }} className='d-flex justify-content-end gap-3'>
          <button className='btn btn-danger' onClick={() => toggleModal()}><i className="bi bi-box-arrow-right"></i> Log Out</button>
          {!changeProfile && <button style={{ padding: '0.4rem 1.5rem', fontSize: 'medium' }} className='btn btn-secondary' onClick={() => setChangeProfile(true)}>Edit</button>}
          {changeProfile && <button style={{ padding: '0.4rem 1.5rem', fontSize: 'medium' }} className='btn btn-success' onClick={() => {
            setChangeProfile(false)
            saveEdition()
          }}>Save</button>}
          {changeProfile && <button style={{ padding: '0.4rem 1.5rem', fontSize: 'medium' }} className='btn btn-danger' onClick={() => {
            setChangeProfile(false)
            CancleEdition()
          }}>Cancel</button>}
        </div>
        <hr />

        {/* ============ Update Profile Form ============ */}
        <br />
        <form onSubmit={(e) => e.preventDefault()} className='form-control d-flex flex-column update-profile-form' style={{ backgroundColor: '#F0F0F0' }}>
          <div className="d-flex flex-column flex-sm-row row">
            <div className="col-12 col-sm-2 img-container">
              <div className='d-flex flex-column align-items-center justify-content-center gap-2'>

                {/* Edit Image */}
                <Edit_UploadImage selectedImage={selectedImage} handleImageChange={handleImageChange} changeProfile={changeProfile} />

              </div>
            </div>
            <div className="col-12 col-sm-10">

              {/* Edit Full Name */}
              <Edit_FullName changeProfile={changeProfile} fullName={fullName} setFullName={setFullName} />

              {/* Edit User Name */}
              <Edit_UserName usernameValue={usernameValue} setUsernameValue={setUsernameValue} validUsernameChecker={validUsernameChecker}
                usernameFocus={usernameFocus} setUsernameFocus={setUsernameFocus} usernameTrue={usernameTrue} setUsernameTrue={setUsernameTrue}
                usernameChecker={usernameChecker} usernameInputStyle={usernameInputStyle} changeProfile={changeProfile}
              />

            </div>
          </div>

          {/* Edit Email */}
          <Edit_Email emailValue={emailValue} setEmailValue={setEmailValue} validEmailChecker={validEmailChecker} emailFocus={emailFocus}
            setEmailFocus={setEmailFocus} emailTrue={emailTrue} setEmailtrue={setEmailtrue} emailChecker={emailChecker}
            emailInputStyle={emailInputStyle} changeProfile={changeProfile}
          />

          {/* Edit Password */}
          <Edit_Password passwordValue={passwordValue} setPasswordValue={setPasswordValue} validPasswordChecker={validPasswordChecker}
            passwordTrue={passwordTrue} setPasswordTrue={setPasswordTrue} passwordType={passwordType} setPasswordType={setPasswordType}
            passwordChecker={passwordChecker} passwordInputStyle={passwordInputStyle} changeProfile={changeProfile}
          />

          {/* Edit Addres */}
          <Edit_Address changeProfile={changeProfile} address={address} setAddress={setAddress} />

          {/* Edit Date of Birth */}
          <Edit_DateOfBirth changeProfile={changeProfile} dateOfBirth={dateOfBirth} setDateOfBirth={setDateOfBirth} />
          <h3><b>Phone Number</b></h3>

          {/* Edit Add Phone Number */}
          <AddPhoneNumber numbers={numbers} newNumber={newNumber} setNewNumber={setNewNumber} handleAddNewNumber={handleAddNewNumber}
            handleDelete={handleDelete} changeProfile={changeProfile}
          />
        </form>
        {/* ================================================ */}
      </div>
    </div>
  )
}

export default UpdateProfile