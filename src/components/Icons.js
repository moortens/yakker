import React from 'react';

import { faSmile } from '@fortawesome/free-regular-svg-icons';
import {
  faHashtag,
  faUser,
  faBars,
  faSearch,
  faCog,
  faCircle,
  faMapMarker,
  faExclamation,
  faPlus,
  faSpinner,
  faUsers,
  faAngleLeft,
  faAngleRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const Hashtag = () => <FontAwesomeIcon icon={faHashtag} />;
export const Smile = () => <FontAwesomeIcon icon={faSmile} />;
export const User = () => <FontAwesomeIcon icon={faUser} />;
export const Users = () => <FontAwesomeIcon icon={faUsers} />;
export const Bars = () => <FontAwesomeIcon icon={faBars} />;
export const Search = () => <FontAwesomeIcon icon={faSearch} />;
export const Settings = () => <FontAwesomeIcon icon={faCog} />;
export const Circle = () => <FontAwesomeIcon icon={faCircle} />;
export const Local = () => <FontAwesomeIcon icon={faMapMarker} />;
export const Exclamation = () => <FontAwesomeIcon icon={faExclamation} />;
export const Plus = () => <FontAwesomeIcon icon={faPlus} />;
export const Spinner = () => <FontAwesomeIcon icon={faSpinner} spin />;
export const AngleLeft = () => <FontAwesomeIcon icon={faAngleLeft} />;
export const AngleRight = () => <FontAwesomeIcon icon={faAngleRight} />;
