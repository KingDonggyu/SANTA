import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import {
  Button,
  Typography,
  Paper,
  TextField,
  Slider,
  Snackbar
} from "@material-ui/core";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ContactPhoneIcon from "@material-ui/icons/ContactPhone";
import DateFnsUtils from "@date-io/date-fns";
import { Alert } from "@material-ui/lab";

import InputMountain from "../../common/InputMountain"

import "./ShowCardPage.scss";
import "./UpdateCard.scss";

function valuetext(value) {
  return `${value}`;
}

export default function UpdateCard(props) {
  const history = useHistory();

  const { card, updateCard } = props;
  const [updateState, setUpdateState] = useState(card);
  const [selectedDate, setSelectedDate] = useState(card.date);
  const [age, setAge] = useState([
    updateState.ageLimit[0],
    updateState.ageLimit[1],
  ]);
  const [snack, setSnack] = useState(false);
  const [isCorrectKeyword, setIsCorrectKeyword] = useState(false);

  const snackClose = () => {
    setSnack(false);
  };

  const handleSubmit = () => {
    if (!isCorrectKeyword) {
      setSnack(true);
    }
    if (isCorrectKeyword) {
      updateCard(updateState);
    }
  }

  const handleChange = (event) => {
    setUpdateState({
      ...updateState,
      [event.target.name]: event.target.value,
    });
  };

  const handleAgeChange = (event, newAge) => {
    setAge(newAge);

    setUpdateState({
      ...updateState,
      ageLimit: newAge,
    });
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setUpdateState({
      ...updateState,
      date: date,
    });
  };

  const getMountainValue = (value) => {
    setUpdateState({
      ...updateState,
      mountain: value,
    });
  };

  const getKeyword = (value) => {
    setIsCorrectKeyword(value);
  };

  const marks = [
    { value: 19 },
    { value: 29 },
    { value: 39 },
    { value: 49 },
    { value: 70 },
  ];

  return (
    <div>
      <div className="show">
        <Paper className="show-paper" elevation={10}>
          <Button
            variant="contained"
            className="back-btn"
            onClick={() => {
              history.goBack();
              localStorage.removeItem("card");
            }}
          >
            <ArrowBackIcon />
          </Button>
          <div id="show-title">
            <TextField
              name="title"
              id="update-title"
              value={updateState.title}
              label="제목"
              inputProps={{ maxLength: 44 }}
              onChange={handleChange}
            />
          </div>
          <Typography
            id="show-name"
            style={{ marginTop: "5px", marginBottom: "10px" }}
          >
            <strong>{card.createdUser?.nickname}</strong> 님의 모임
          </Typography>
          <div className="show-flex">
            <div className="show-box" style={{ width: "65%" }}>
              <header className="show-header">
                <div className="header-detail">
                  <div className="header-info-update">
                    <InputMountain
                      id="search-mountain"
                      getMountainValue={getMountainValue}
                      getKeyword={getKeyword}
                    />
                  </div>
                  <div className="header-info-update">
                    <TextField
                      name="maxMember"
                      id="update-maxMember"
                      label="제한 인원"
                      type="number"
                      defaultValue={updateState.maxMember}
                      inputProps={{ min: 1 }}
                      InputLabelProps={{ shrink: true }}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="header-info-update" id="update-age">
                    <Typography id="update-slider-label" gutterBottom>
                      제한 연령
                    </Typography>
                    <Slider
                      name="ageLimit"
                      id="update-age-slider"
                      max={70}
                      min={19}
                      marks={marks}
                      value={age}
                      onChange={handleAgeChange}
                      valueLabelDisplay="auto"
                      aria-labelledby="range-slider"
                      getAriaValueText={valuetext}
                    />
                  </div>
                  <div className="header-info-update" id="update-date">
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        disableToolbar
                        variant="inline"
                        format="yyyy-MM-dd"
                        margin="normal"
                        minDate={new Date()}
                        id="input-date"
                        label="가고 싶은 날짜"
                        value={selectedDate}
                        onChange={handleDateChange}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        autoOk={true}
                      />
                    </MuiPickersUtilsProvider>
                  </div>
                </div>
              </header>
              <br />
              <section className="show-body" style={{ height: "150px" }}>
                <textarea
                  required
                  name="description"
                  value={updateState.description}
                  placeholder="내용을 입력하세요. *"
                  id="update-description"
                  className="update-textarea"
                  onChange={handleChange}
                />
              </section>
            </div>
            <Paper className="side" elevation={5} style={{marginTop: "65px"}}>
              <div
                id="contact-paper"
                className="side-paper"
                style={{ height: "160px" }}
              >
                <span>
                  <ContactPhoneIcon id="contact-icon" />
                  <strong> 연락망</strong>
                </span>
                <textarea
                  required
                  name="contact"
                  value={updateState.contact}
                  placeholder="연락망을 입력하세요. *
                   (ex. 연락처, 카카오톡 오픈채팅 등)"
                  id="update-contact"
                  className="update-textarea"
                  onChange={handleChange}
                />
              </div>
              <div id="Member-paper" className="side-paper">
                <Typography>
                  <strong>현재 인원:</strong> {card.currentMember.length + 1} /{" "}
                  {card.maxMember}
                </Typography>
                <div className="Member-info">
                  <Typography>
                    <span>★</span>
                    {card.createdUser?.nickname}
                    {card.currentMember?.map((member) => {
                      return <Typography>{member?.nickname}</Typography>;
                    })}
                  </Typography>
                </div>
              </div>
              <div id="btn-paper" className="side-paper">
                <Button
                  variant="contained"
                  id="update-btn"
                  onClick={handleSubmit}
                >
                  <CheckCircleIcon />
                </Button>
                <Snackbar open={snack} autoHideDuration={6000} onClose={snackClose}>
                  <Alert onClose={snackClose} severity="error" variant="filled">
                    가고 싶은 산을 선택해주세요!
                  </Alert>
              </Snackbar>
              </div>
            </Paper>
          </div>
        </Paper>
      </div>
    </div>
  );
}
