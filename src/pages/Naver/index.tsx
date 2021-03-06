/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useState, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';
import { FontAwesome5 as Icon } from '@expo/vector-icons';
import { useTheme } from 'styled-components';
import { differenceInYears } from 'date-fns';

import ModalRemoveNaver from '../../components/ModalRemoveNaver';

import {
  Container,
  Content,
  Avatar,
  Name,
  InfoText,
  Controll,
  ControllButton,
  ControllButtonText,
} from './styles';
import api from '../../services/api';

interface NaverProps {
  id: string;
  name: string;
  job_role: string;
  admission_date: string;
  project: string;
  birthdate: string;
  url: string;
}
// Com esta interface é possível fazer o typescript reconhecer as propriedades passadas no params de dentro de route
interface NaverRouteProps {
  params: {
    naverId: string;
  };
}

const Naver: React.FC = () => {
  const { colors } = useTheme();
  const { navigate } = useNavigation();
  const {
    params: { naverId },
  } = useRoute() as NaverRouteProps;

  const [naver, setNaver] = useState({} as NaverProps);
  const [modalVisible, setModalVisible] = useState(false);
  // Garante que os dados do naver serão atualizados ao voltar da tela de edição
  useFocusEffect(
    useCallback(() => {
      try {
        if (naverId)
          api
            .get(`/navers/${naverId}`)
            .then(response => setNaver(response.data));
      } catch (err) {
        Alert.alert('Erro ao localizar naver');
      }
    }, [naverId]),
  );
  // Pega o atual estado da variável modalVisible e inverte seu valor.
  const handleToggleModal = useCallback(
    () => setModalVisible(state => !state),
    [],
  );

  const ageFormatted = useMemo(
    () => `${differenceInYears(new Date(), new Date(naver.birthdate))} anos`,
    [naver.birthdate],
  );

  const admissionDateFormatted = useMemo(() => {
    const years = differenceInYears(new Date(), new Date(naver.admission_date));
    return `${years} ${years === 1 ? ' ano' : ' anos'}`;
  }, [naver.admission_date]);

  return (
    <Container>
      <ModalRemoveNaver
        naverId={naverId}
        handleToggleModal={handleToggleModal}
        modalVisible={modalVisible}
        refreshPage={() => {}}
      />

      <Avatar
        source={{
          uri: `https://api.adorable.io/avatars/156/${naver.url}`,
        }}
      />
      <Content>
        <Name>{naver.name}</Name>
        <InfoText>{naver.job_role}</InfoText>

        <InfoText legend>Idade</InfoText>
        <InfoText>{ageFormatted}</InfoText>

        <InfoText legend>Tempo de empresa</InfoText>
        <InfoText>{admissionDateFormatted}</InfoText>

        <InfoText legend>Projetos que participou</InfoText>
        <InfoText>{naver.project}</InfoText>

        <Controll>
          <ControllButton onPress={handleToggleModal}>
            <Icon name="trash" size={18} color={colors.black} />
            <ControllButtonText style={{ color: colors.black }}>
              Excluir
            </ControllButtonText>
          </ControllButton>

          <ControllButton
            onPress={() => navigate('EditNaver', { naverId: naver.id })}
            style={{ marginLeft: 16, backgroundColor: colors.black }}
          >
            <Icon name="pencil-alt" size={18} color={colors.white} />
            <ControllButtonText style={{ color: colors.white }}>
              Editar
            </ControllButtonText>
          </ControllButton>
        </Controll>
      </Content>
    </Container>
  );
};

export default Naver;
