import axios from "axios";
import { useState } from "react";

const UseEmail = (endpointUrl) => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const sendEmail = (data) => {
    setLoading(true);
    setSubmitted(false);
    setError(undefined);

    axios.post(endpointUrl, {body: JSON.stringify(data)}).then((response) => {

        if (response.status === 422) {
          throw new Error("Are you robot?");
        }

        if (response.status !== 200) {
          throw new Error(`${response.statusText} (${response.status})`);
        }

        return response.json();
      })
      .then(() => {
        setSubmitted(true);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.toString())
        setLoading(false);
      });
  };


  return {
    submitted, loading, error, sendEmail
  }
};

export default UseEmail;