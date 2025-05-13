import { useEffect, useState } from "@lynx-js/react";
import { useNavigate } from 'react-router';
import Logo from "../../assets/logo.png";
import styles from "./splashScreen.module.css";

const SplashScreen = () => {
  const nav = useNavigate();
  const [animationClass, setAnimationClass] = useState(styles.logoHidden);

  useEffect(() => {
    // Start animation immediately
    setTimeout(() => {
      setAnimationClass(`${styles.logo} ${styles.logoAnimate}`);
    }, 100);

    // Navigate after animation completes
    setTimeout(() => {
      nav('/home')
    }, 1500)
  }, [])

  return (
    <view class={styles.container}>
      <image src={Logo} class={animationClass} />
    </view>
  )
}

export default SplashScreen
