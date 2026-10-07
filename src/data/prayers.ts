import type { Prayer, PrayerKey } from './types'

/** Textos litúrgicos de dominio público, redacción ES-LATAM propia. */
export const PRAYERS: Record<PrayerKey, Prayer> = {
  senal_cruz: {
    key: 'senal_cruz',
    titleEs: 'Señal de la Cruz',
    bodyEs:
      'En el nombre del Padre, y del Hijo, y del Espíritu Santo. Amén.',
  },
  credo: {
    key: 'credo',
    titleEs: 'Credo',
    bodyEs:
      'Creo en Dios, Padre todopoderoso, Creador del cielo y de la tierra. Creo en Jesucristo, su único Hijo, nuestro Señor, que fue concebido por obra y gracia del Espíritu Santo, nació de santa María Virgen, padeció bajo el poder de Poncio Pilato, fue crucificado, muerto y sepultado, descendió a los infiernos, al tercer día resucitó de entre los muertos, subió a los cielos y está sentado a la derecha de Dios, Padre todopoderoso. Desde allí ha de venir a juzgar a vivos y muertos. Creo en el Espíritu Santo, la santa Iglesia católica, la comunión de los santos, el perdón de los pecados, la resurrección de la carne y la vida eterna. Amén.',
  },
  padre_nuestro: {
    key: 'padre_nuestro',
    titleEs: 'Padre Nuestro',
    bodyEs:
      'Padre nuestro, que estás en el cielo, santificado sea tu Nombre; venga a nosotros tu Reino; hágase tu voluntad en la tierra como en el cielo. Danos hoy nuestro pan de cada día; perdona nuestras ofensas, como también nosotros perdonamos a los que nos ofenden; no nos dejes caer en la tentación, y líbranos del mal. Amén.',
  },
  ave_maria: {
    key: 'ave_maria',
    titleEs: 'Ave María',
    bodyEs:
      'Dios te salve, María, llena eres de gracia; el Señor es contigo. Bendita tú eres entre todas las mujeres, y bendito es el fruto de tu vientre, Jesús. Santa María, Madre de Dios, ruega por nosotros, pecadores, ahora y en la hora de nuestra muerte. Amén.',
  },
  gloria: {
    key: 'gloria',
    titleEs: 'Gloria',
    bodyEs:
      'Gloria al Padre, y al Hijo, y al Espíritu Santo. Como era en el principio, ahora y siempre, por los siglos de los siglos. Amén.',
  },
  oh_mi_jesus: {
    key: 'oh_mi_jesus',
    titleEs: 'Oración de Fátima',
    bodyEs:
      'Oh Jesús mío, perdona nuestros pecados, líbranos del fuego del infierno, lleva al cielo a todas las almas, especialmente a las más necesitadas de tu misericordia. Amén.',
  },
  salve: {
    key: 'salve',
    titleEs: 'Salve',
    bodyEs:
      'Dios te salve, Reina y Madre de misericordia, vida, dulzura y esperanza nuestra; Dios te salve. A ti clamamos los desterrados hijos de Eva; a ti suspiramos, gimiendo y llorando, en este valle de lágrimas. Ea, pues, Señora, abogada nuestra, vuelve a nosotros esos tus ojos misericordiosos; y después de este destierro muéstranos a Jesús, fruto bendito de tu vientre. Oh clemente, oh piadosa, oh dulce Virgen María. Ruega por nosotros, santa Madre de Dios, para que seamos dignos de alcanzar las promesas de nuestro Señor Jesucristo. Amén.',
  },
  eterno_padre: {
    key: 'eterno_padre',
    titleEs: 'Padre Eterno',
    bodyEs:
      'Padre eterno, te ofrezco el Cuerpo y la Sangre, el Alma y la Divinidad de tu amadísimo Hijo, nuestro Señor Jesucristo, como propiciación de nuestros pecados y los del mundo entero.',
  },
  por_su_pasion: {
    key: 'por_su_pasion',
    titleEs: 'Por su Pasión',
    bodyEs:
      'Por su dolorosa Pasión, ten misericordia de nosotros y del mundo entero.',
  },
  santo_dios: {
    key: 'santo_dios',
    titleEs: 'Santo Dios',
    bodyEs:
      'Santo Dios, Santo Fuerte, Santo Inmortal, ten piedad de nosotros y del mundo entero.',
  },
  jesus_en_ti_confio: {
    key: 'jesus_en_ti_confio',
    titleEs: 'Jesús, en Ti confío',
    bodyEs: 'Jesús, en Ti confío.',
  },
}

export function getPrayer(key: PrayerKey): Prayer {
  return PRAYERS[key]
}

/** MVP library order for P01 (architecture PrayerKeys). */
export const PRAYER_LIST_ORDER: PrayerKey[] = [
  'senal_cruz',
  'credo',
  'padre_nuestro',
  'ave_maria',
  'gloria',
  'oh_mi_jesus',
  'salve',
  'eterno_padre',
  'por_su_pasion',
  'santo_dios',
  'jesus_en_ti_confio',
]

export function listPrayers(): Prayer[] {
  return PRAYER_LIST_ORDER.map((key) => PRAYERS[key])
}

export function isPrayerKey(value: string): value is PrayerKey {
  return value in PRAYERS
}
