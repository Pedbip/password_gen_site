// Simple translation hook that detects user locale and translates text
import { useState, useEffect } from 'react';

const translations = {
  'pt-BR': {
    // App name
    'Secure Password Share': 'Compartilhamento Seguro de Senhas',
    
    // Main page
    'Password Generator': 'Gerador de Senhas',
    'Enter the password you want to share': 'Digite a senha que vai compartilhar',
    'Characters': 'Caracteres',
    'Need help generating a secure password?': 'Precisa de uma ajuda para gerar uma senha segura?',
    'Click the "Generate password" button or change the options': 'Clique no botão "Gerar senha" ou altere as opções',
    'Generate password': 'Gerar senha',
    'Generating...': 'Gerando...',
    'Generate link': 'Gerar link',
    'Generating link...': 'Gerando link...',
    'Options': 'Opções',
    'Hide options': 'Ocultar opções',
    'Size:': 'Tamanho:',
    'Include symbols:': 'Incluir símbolos:',
    'Include numbers:': 'Incluir números:',
    'How many days should it be available?': 'Por quantos dias deve ficar disponível?',
    'day': 'dia',
    'days': 'dias',

    'What is the maximum number of views possible?': 'Qual o máximo de visualizações possíveis?',
    'view': 'visualização',
    'views': 'visualizações',
    'This password will be available until the first occurs:': 'Esta senha ficará disponível ao que ocorrer primeiro:',
    'or': 'ou',
    
    // Share page
    'Use this link to share the password:': 'Use este link para compartilhar a senha:',
    'Copy': 'Copiar',
    'Copied': 'Copiado',
    'Link copied to clipboard!': 'Link copiado para a área de transferência!',
    'Create new password': 'Criar nova senha',
    
    // View page
    'This is the password that was shared with you': 'Esta é a senha que foi compartilhada com você',
    'Click on the password to view it or on the button to copy': 'Clique na senha para visualizá-la ou no botão para copiar',
    'Loading...': 'Carregando...',
    'This password will be available until': 'Esta senha estará disponível até',
    'or for': 'ou por mais',
    'more views.': 'visualizações.',
    'Created on:': 'Criada em:',
    'If you want to revoke access to this password, click': 'Caso queira revogar o acesso a esta senha, clique em',
    'Revoke': 'Revogar',
    'Password Unavailable': 'Senha Indisponivel',
    
    // Security messages
    'All passwords are encrypted before storage and are only available to those with the secret link.': 'Todas as senhas são criptografadas antes do armazenamento e estão disponíveis apenas para aqueles com o link secreto.',
    'Once expired, encrypted passwords are deleted from the database.': 'Uma vez expiradas, as senhas criptografadas são excluídas do banco de dados.',
    'The system ensures maximum security through end-to-end encryption.': 'O sistema garante máxima segurança através de criptografia de ponta a ponta.',
    'Your data is protected with the highest digital security standards.': 'Seus dados são protegidos com os mais altos padrões de segurança digital.',
    'Passwords are generated using secure and random algorithms.': 'As senhas são geradas usando algoritmos seguros e aleatórios.',
    'No personal information is stored on our servers.': 'Nenhuma informação pessoal é armazenada em nossos servidores.',
    
    // Error messages
    'The password must be at least 4 characters.': 'A senha deve ter pelo menos 4 caracteres.',
    'The password cannot be more than 128 characters.': 'A senha não pode ter mais de 128 caracteres.',
    'Please enter a password before generating the link.': 'Por favor, digite uma senha antes de gerar o link.',
    'Error generating password. Try again.': 'Erro ao gerar senha. Tente novamente.',
    'Error generating link. Try again.': 'Erro ao gerar link. Tente novamente.'
  },
  'es': {
    // App name
    'Secure Password Share': 'Compartir Contraseñas Seguras',
    
    // Main page
    'Password Generator': 'Generador de Contraseñas',
    'Enter the password you want to share': 'Ingresa la contraseña que quieres compartir',
    'Characters': 'Caracteres',
    'Need help generating a secure password?': '¿Necesitas ayuda para generar una contraseña segura?',
    'Click the "Generate password" button or change the options': 'Haz clic en el botón "Generar contraseña" o cambia las opciones',
    'Generate password': 'Generar contraseña',
    'Generating...': 'Generando...',
    'Generate link': 'Generar enlace',
    'Generating link...': 'Generando enlace...',
    'Options': 'Opciones',
    'Hide options': 'Ocultar opciones',
    'Size:': 'Tamaño:',
    'Include symbols:': 'Incluir símbolos:',
    'Include numbers:': 'Incluir números:',
    'How many days should it be available?': '¿Por cuántos días debe estar disponible?',
    'day': 'día',
    'days': 'días',
    'What is the maximum number of views possible?': '¿Cuál es el número máximo de visualizaciones posibles?',
    'view': 'visualización',
    'views': 'visualizaciones',
    'This password will be available until the first occurs:': 'Esta contraseña estará disponible hasta que ocurra lo primero:',
    'or': 'o',
    
    // Share page
    'Use this link to share the password:': 'Usa este enlace para compartir la contraseña:',
    'Copy': 'Copiar',
    'Copied': 'Copiado',
    'Link copied to clipboard!': '¡Enlace copiado al portapapeles!',
    'Create new password': 'Crear nueva contraseña',
    
    // View page
    'This is the password that was shared with you': 'Esta es la contraseña que fue compartida contigo',
    'Click on the password to view it or on the button to copy': 'Haz clic en la contraseña para verla o en el botón para copiar',
    'Loading...': 'Cargando...',
    'This password will be available until': 'Esta contraseña estará disponible hasta',
    'or for': 'o por',
    'more views.': 'visualizaciones más.',
    'Created on:': 'Creada el:',
    'If you want to revoke access to this password, click': 'Si quieres revocar el acceso a esta contraseña, haz clic en',
    'Revoke': 'Revocar',
    'Password Unavailable': 'Contraseña Indisponible',
    
    // Security messages
    'All passwords are encrypted before storage and are only available to those with the secret link.': 'Todas las contraseñas están encriptadas antes del almacenamiento y solo están disponibles para aquellos con el enlace secreto.',
    'Once expired, encrypted passwords are deleted from the database.': 'Una vez expiradas, las contraseñas encriptadas se eliminan de la base de datos.',
    'The system ensures maximum security through end-to-end encryption.': 'El sistema garantiza máxima seguridad a través de encriptación de extremo a extremo.',
    'Your data is protected with the highest digital security standards.': 'Tus datos están protegidos con los más altos estándares de seguridad digital.',
    'Passwords are generated using secure and random algorithms.': 'Las contraseñas se generan usando algoritmos seguros y aleatorios.',
    'No personal information is stored on our servers.': 'No se almacena información personal en nuestros servidores.',
    
    // Error messages
    'The password must be at least 4 characters.': 'La contraseña debe tener al menos 4 caracteres.',
    'The password cannot be more than 128 characters.': 'La contraseña no puede tener más de 128 caracteres.',
    'Please enter a password before generating the link.': 'Por favor ingresa una contraseña antes de generar el enlace.',
    'Error generating password. Try again.': 'Error al generar contraseña. Intenta de nuevo.',
    'Error generating link. Try again.': 'Error al generar enlace. Intenta de nuevo.'
  }
};

export function useTranslation() {
  const [locale, setLocale] = useState('en');

  useEffect(() => {
    // Detect user locale from browser
    const userLocale = navigator.language || 'en';
    
    // Set locale based on detection
    if (userLocale.startsWith('pt')) {
      setLocale('pt-BR');
    } else if (userLocale.startsWith('es')) {
      setLocale('es');
    } else {
      setLocale('en');
    }
  }, []);

  const t = (key: string): string => {
    if (locale === 'en') {
      return key; // Return original English text
    }
    
    const translation = translations[locale as keyof typeof translations];
    return translation?.[key as keyof typeof translation] || key;
  };

  return { t, locale };
}
