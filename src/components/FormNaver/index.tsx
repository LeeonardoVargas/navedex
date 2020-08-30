/* eslint-disable camelcase */
import React, { useRef, useState, useCallback } from 'react';
import { TextInput, Platform, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import * as Yup from 'yup';

import Input from '../Input';
import { Label } from '../Input/styles';

import {
  Form,
  Button,
  ButtonText,
  ButtonDatePicker,
  ButtonDatePickerText,
} from './styles';

export interface NaverProps {
  name: string;
  job_role: string;
  admission_date: string;
  project: string;
  birthdate: string;
  url: string;
}

interface FormNaverProps {
  onSubmit(naver: NaverProps): void;
  initialData?: NaverProps;
}

interface Errors {
  [key: string]: string;
}

const FormNaver: React.FC<FormNaverProps> = ({ onSubmit, initialData }) => {
  const fieldsForm = {
    name: '',
    job_role: '',
    admission_date: '',
    project: '',
    birthdate: '',
    url: '',
  };

  const [naver, setNaver] = useState<NaverProps>(fieldsForm);

  const [errorsInputs, setErrorsInputs] = useState(fieldsForm);

  const [admissionDate, setAdmissionDate] = useState(new Date());
  const [birthdate, setBirthdate] = useState(new Date());

  const [showDatePicker, setShowDatePicker] = useState({
    admission: false,
    birthdate: false,
  });

  // const inputJobRole = useRef<TextInput>(null);
  // const inputBirthdate = useRef<TextInput>(null);
  // const inputProject = useRef<TextInput>(null);
  // const inputurl = useRef<TextInput>(null);

  const handleDateChanged = useCallback(
    (date: Date | undefined, field: string) => {
      if (Platform.OS === 'android')
        setShowDatePicker({
          admission: false,
          birthdate: false,
        });

      if (date) {
        if (field === 'birthdate') setBirthdate(date);
        else setAdmissionDate(date);
      }
    },
    [naver],
  );

  // A propriedade date pode ser undefined quando o usuário clicar no botão cancelar no Android
  const handleDataBirthdate = useCallback(
    (event, date: Date | undefined) => handleDateChanged(date, 'birthdate'),
    [],
  );
  // A propriedade date pode ser undefined quando o usuário clicar no botão cancelar no Android
  const handleDataAdmissionDate = useCallback(
    (event, date: Date | undefined) =>
      handleDateChanged(date, 'admission_date'),
    [],
  );

  const handleSubmitForm = useCallback(async () => {
    setErrorsInputs(fieldsForm); // Limpando os erros

    try {
      const naverFormatted: NaverProps = {
        ...naver,
        admission_date: format(admissionDate, 'dd/MM/yyyy'),
        birthdate: format(birthdate, 'dd/MM/yyyy'),
      };
      const schema = Yup.object().shape({
        name: Yup.string().required('O nome é obrigatório'),
        job_role: Yup.string().required('O cargo é obrigatório'),
        admission_date: Yup.string().required(
          'A data da admissão é obrigatória',
        ),
        project: Yup.string().required(
          'O nome dos projetos participados é obrigatório',
        ),
        birthdate: Yup.string().required('O dia do aniversário é obrigatório'),
        url: Yup.string().required('A url da foto é obrigatória'),
      });

      await schema.validate(naverFormatted, {
        abortEarly: false,
      });
      onSubmit(naverFormatted);
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const validationErrors: Errors = {};
        err.inner.forEach(e => {
          validationErrors[e.path] = e.message;
        });

        setErrorsInputs({ ...fieldsForm, ...validationErrors });

        Alert.alert(
          'Erro na autenticação',
          'Verifique os campos do formulário',
        );
      }
    }
  }, [naver, onSubmit, admissionDate, birthdate]);

  return (
    <Form>
      <Input
        label="Nome"
        error={errorsInputs.name}
        value={naver.name}
        onChangeText={value => setNaver({ ...naver, name: value })}
        autoCapitalize="words"
        keyboardType="default"
        placeholder="Nome"
        returnKeyType="next"
        // onSubmitEditing={() => inputJobRole.current?.focus()}
      />

      <Input
        // ref={inputJobRole}
        label="Cargo"
        error={errorsInputs.job_role}
        value={naver.job_role}
        onChangeText={value => setNaver({ ...naver, job_role: value })}
        autoCapitalize="sentences"
        keyboardType="default"
        placeholder="Cargo"
        returnKeyType="next"
        // onSubmitEditing={() => inputBirthdate.current?.focus()}
      />

      <Label>Idade</Label>
      <ButtonDatePicker
        onPress={() =>
          setShowDatePicker({
            ...showDatePicker,
            birthdate: !showDatePicker.birthdate,
          })
        }
      >
        <ButtonDatePickerText>Selecionar uma data</ButtonDatePickerText>
      </ButtonDatePicker>

      {showDatePicker.birthdate && (
        <DateTimePicker
          mode="date"
          display="calendar"
          onChange={handleDataBirthdate}
          value={birthdate}
        />
      )}

      <Label>Tempo de Empresa</Label>
      <ButtonDatePicker
        onPress={() =>
          setShowDatePicker({
            ...showDatePicker,
            admission: !showDatePicker.admission,
          })}
      >
        <ButtonDatePickerText>Selecionar uma data</ButtonDatePickerText>
      </ButtonDatePicker>

      {showDatePicker.admission && (
        <DateTimePicker
          mode="date"
          display="calendar"
          onChange={handleDataAdmissionDate}
          value={admissionDate}
        />
      )}

      <Input
        // ref={inputProject}
        label="Projetos que participou"
        error={errorsInputs.project}
        value={naver.project}
        onChangeText={value => setNaver({ ...naver, project: value })}
        autoCapitalize="none"
        keyboardType="default"
        placeholder="Projetos que participou"
        returnKeyType="next"
        // onSubmitEditing={() => inputurl.current?.focus()}
      />

      <Input
        // ref={inputurl}
        label="URL da foto do naver"
        error={errorsInputs.url}
        value={naver.url}
        onChangeText={value => setNaver({ ...naver, url: value })}
        autoCapitalize="none"
        keyboardType="url"
        placeholder="URL da foto do naver"
        returnKeyType="send"
      />

      <Button onPress={() => handleSubmitForm()}>
        <ButtonText>Salvar</ButtonText>
      </Button>
    </Form>
  );
};

export default FormNaver;
