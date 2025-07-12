import { createServerContext } from "react"
import { connect } from "react-redux"
// import { pixel_background } from "./themes"
import { toggleUi } from "../../../src/store/gameReducer"
// import Arcanum from "@templates/Arcanum"
// import Armory from "@templates/Armory"
// import Character from "@templates/Character"
import CharacterSelect from "../components/templates/CharacterSelect"
// import Equipment from "@templates/Equipment"
import Header from "../components/organisms/Header"
// import HUD from "@templates/HUD"
// import Save from "@templates/Save"
import System from "../components/templates/System"
// import CustomDragLayer from "@protons/CustomDragLayer"
// import "styled-components/macro"
import variables from './variables.module.scss'
import styles from './styles.module.scss'

const config = {
    // arcanum: {
    //     component: Arcanum,
    //     title: "Arcanum",
    //     navigation: true
    // },
    // armory: {
    //     component: Armory,
    //     title: "Armory",
    //     navigation: true
    // },
    // character: {
    //     component: Character,
    //     title: "Character",
    //     navigation: true
    // },
    // equipment: {
    //     component: Equipment,
    //     title: "Equipment",
    //     navigation: true
    // },
    // load: {
    //     component: Save,
    //     title: "Load Game",
    //     props: {load: true},
    //     close: true
    // },
    // save: {
    //     component: Save,
    //     title: "Pick a Game Save"
    // },
    select: {
        component: CharacterSelect,
        title: "Character Select",
        props: {}
    },
    system: {
        component: System,
        title: "System",
        props: {},
        close: true
    }
};

interface Props {
    menu: keyof typeof config | undefined
    showHUD: Boolean;
    showUi: Boolean;
    toggleUi: Boolean;
}

type MenuContextType = keyof typeof config;

export const MenuContext = createServerContext<MenuContextType>('menu', 'select');

const UI = ({ menu = 'select', showHUD, showUi = true, toggleUi = true }: Props) => {
    // Use specified menu otherwise use equipment as default
    const currentMenu = config[menu];

    return (
        <div className={styles.uiContainer}>
            {/* {showHUD &&
                <HUD />
            } */}
            {showUi &&
                <div className={styles.uiVisibility}>
                    <div className={styles.uiHeader}>
                        <Header config={currentMenu} toggleUi={toggleUi} />
                    </div>
                    <div
                        id={ currentMenu.title.toLowerCase().replace(" ", "-") }
                        className={menu === "system" ? undefined : styles.uiMenu }
                        style={{ width: menu === "system" ? '200px' : '100%' }}
                    >
                        {/* <CustomDragLayer /> */}
                        <MenuContext.Provider value={menu}>
                            <currentMenu.component {...currentMenu.props} />
                        </MenuContext.Provider>
                    </div>
                </div>
            }
        </div>
    );
}

const mapStateToProps = (state:Props) => {
    const { menu, showUi, showHUD } = state;
    return { menu, showHUD, showUi }
};

export default connect(mapStateToProps, { toggleUi })(UI);
// export default UI;