import Logo from "../../assets/logo.png";
import Card from "../../components/Card/index.js";
import { HADISTS } from "../../constants/hadist.js";
import styles from "./mainScreen.module.css";

const MainScreen = () => {
  return (
    <view class={styles.container}>
      <view class={styles.logoContainer}>
        <image src={Logo} class={styles.logo} />
        <text class={styles.logoText}>Hadist App</text>
      </view>
      <list
        scroll-orientation="vertical"
        list-type="single"
        span-count={1}
        style={{
          width: "100%",
          height: "100vh",
          listMainAxisGap: "16px",
          padding: "10px",
        }}
      >
        {HADISTS.map((hadist, index) => (
          <list-item
            item-key={`hadist-${index}`}>
            <Card icon="" text={hadist.title} id={index} />
          </list-item>
        ))}
      </list>
      <text class="text-red-500">main screenn</text>
    </view>
  )
}

export default MainScreen;