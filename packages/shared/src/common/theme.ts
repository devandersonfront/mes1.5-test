import indigo from '@material-ui/core/colors/indigo';
import pink from '@material-ui/core/colors/pink';
import {createMuiTheme} from '@material-ui/core/styles';
import {deepOrange} from "@material-ui/core/colors";

export const theme = createMuiTheme({
  palette: {
    primary: indigo,
    secondary: pink,
    warning: deepOrange,
  },
});

export const lightTheme = {
  body: '#fff',
  text: '#363537',
  toggleBorder: '#FFF',
  gradient: 'linear-gradient(#39598A, #79D7ED)',
}

export const darkTheme = {
  body: '#363537',
  text: '#FAFAFA',
  toggleBorder: '#6B8096',
  gradient: 'linear-gradient(#091236, #1E215D)',
}
