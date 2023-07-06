import { useState } from "react";
import { useHistory } from 'react-router-dom';
import { Box, Button, Grid, TextField } from '@mui/material';

type Props = {
  onSubmit: (name: string, age: number) => void;
};





const RegisterForm = (props: Props) => {


  

////////////////////////////////////////////////

  const [name, setName] = useState("");
  const [age, setAge] = useState(parseInt(""));

  const submit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // props.onSubmit(e);
    props.onSubmit(name, age);
      if (!name) {
        alert("Please enter name");
        return;
      }else if(!age){
        alert("Please enter age");
        return;
      }
    if (name.length > 26) {
      alert("Please enter a name shorter than 50 characters");
      return;
    }
    setName("");
    setAge(parseInt(""));
  };
  

  return (
    <Box component="form" noValidate onSubmit={submit} sx={{ mt: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="name"
            label="Name"
            name="name"
            autoComplete="off"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="age"
            label="Age"
            name="age"
            autoComplete="off"
            type="number"
            value={age || ''}
            onChange={(e) => setAge(parseInt(e.target.value))}
          />
        </Grid>
      </Grid>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        POST
      </Button>
    </Box>
    
  );
};

export default RegisterForm;