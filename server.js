require('dotenv').config();
const express = require('express');
const fs = require('fs');
const https = require('https');
const axios = require('axios');
const convert = require('xml-js');
const { isValidFormatPin } = require('./utils/isValidFormatPin');
const { isValidSwedishPin } = require('./utils/isValidSwedishPin');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.post('/people/search', async (req, res) => {
  const { pin } = req.body;

  if (!pin) {
    return res.status(400).json({
      message: 'Please enter 10 or 12 digits personal identity number',
    });
  }

  const pinIsValid = isValidFormatPin(pin) && isValidSwedishPin(pin);

  if (!pinIsValid) {
    return res
      .status(400)
      .json({ message: 'Personal identity number is not valid' });
  }

  const data = `
      <soap:Envelope
      xmlns:fraga="http://statenspersonadressregister.se/schema/personsok/2021.1/personsokningfraga"
      xmlns:idinfo="http://statenspersonadressregister.se/schema/komponent/metadata/identifieringsinformationWs-1.1"
      xmlns:person="http://statenspersonadressregister.se/schema/komponent/person/person-1.2"
      xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
      xmlns:sok="http://statenspersonadressregister.se/schema/komponent/sok/personsokningsokparametrar-1.1">
      <soap:Header/>
      <soap:Body>
      <fraga:SPARPersonsokningFraga>
      <idinfo:Identifieringsinformation>
      <idinfo:KundNrLeveransMottagare>${process.env.CUSTOM_NO_RECEIVER}</idinfo:KundNrLeveransMottagare>
      <idinfo:KundNrSlutkund>${process.env.CUSTOM_NO_END}</idinfo:KundNrSlutkund>
      <idinfo:UppdragId>${process.env.TASK_ID}</idinfo:UppdragId>
      <idinfo:SlutAnvandarId>${process.env.END_USER_ID}</idinfo:SlutAnvandarId>
      </idinfo:Identifieringsinformation>
      <sok:PersonsokningFraga>
      <person:IdNummer>${pin}</person:IdNummer>
      </sok:PersonsokningFraga>
      </fraga:SPARPersonsokningFraga>
      </soap:Body>
      </soap:Envelope>
    `;

  const config = {
    method: 'POST',
    url: process.env.SPAR_URL,
    httpsAgent: new https.Agent({
      key: fs.readFileSync(process.env.KEY_PATH),
      cert: fs.readFileSync(process.env.CERT_PATH),
      keepAlive: true,
    }),
    headers: {
      SOAPAction:
        'http://skatteverket.se/spar/personsok/2021.1/PersonsokService/Personsok',
      'Content-Type': 'text/xml',
    },
    data: data,
  };

  axios
    .request(config)
    .then((response) => {
      const formatResponse = JSON.parse(
        convert.xml2json(response.data, {
          compact: true,
        })
      );

      const { 'ns25:PersonsokningSvarspost': pinInfo } =
        formatResponse['S:Envelope']?.['S:Body']?.[
          'ns25:SPARPersonsokningSvar'
        ] || {};

      if (!pinInfo) {
        res.status(404).json({
          message: 'Personal identity number not found',
        });
      }

      res.status(200).send(pinInfo);
    })
    .catch((error) => {
      console.log(
        error.response.status,
        error.response.statusText,
        error.response.data
      );

      res.status(error.response?.status).json({
        error: error.response?.statusText,
      });
    });
});

app.listen(PORT, () => console.log(`Running on port ${PORT}`));
