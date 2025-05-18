import { useNavigate } from 'react-router-dom';
import styles from './card.module.css';
type Props = {
  text: string;
  icon: string;
  id: number;
}
const Card = (props: Props) => {
  const nav = useNavigate();
  const {
    text,
    icon,
    id,
  } = props;
  return (
    <view class={styles.container} bindtap={() => nav(`/hadist/${id}`)}>
      <text>{text}</text>
      <image src={icon}/>
    </view>
  )
}

export default Card