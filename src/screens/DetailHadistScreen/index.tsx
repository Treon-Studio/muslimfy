import { useNavigate, useParams } from 'react-router';
import { HADISTS } from '../../constants/hadist.js';
import IconArrow from '../../assets/IcArrow.png';
import styles from './detailHadistScreen.module.css';

const DetailHadistScreen = () => {
  const nav = useNavigate();
  const { id } = useParams();
  const hadist = HADISTS[(id ?? 0) as number]
  const handelGoBack = () => {
    nav('/home')
  }
  return (
    <view class={styles.container}>
      <view bindtap={handelGoBack} style={{display: 'flex', gap: 24, marginBottom: 40, alignItems: 'center'}}>
        <image src={IconArrow} style={{width: 55, height: 55}}/>
        <text style={{fontWeight: '700'}}>Back</text>
      </view>
      <scroll-view>
        <text class={styles.title}>{hadist.title}</text>
        <text class={styles.arabic}>{hadist.arabic}</text>
        <text>{hadist.translation}</text>
        <text class={styles.sourceText}>{hadist.source}</text>
      </scroll-view>
    </view>
  )
}

export default DetailHadistScreen