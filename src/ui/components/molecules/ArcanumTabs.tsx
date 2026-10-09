import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setArcanumTab } from "@store/gameReducer";
import type { ArcanumTab } from "@store/gameReducer";
import HeaderTabs from "./HeaderTabs";
import type { RootState } from "@store";

// Order and labels of the Arcanum's header tabs (a Fuse tab joins later, #583).
const TABS: { id: ArcanumTab; label: string }[] = [
    { id: "merge", label: "Merge" },
    { id: "craft", label: "Craft" },
];

// The Arcanum's Merge/Craft tabs, in the shared overlay header.
const ArcanumTabs: React.FC = () => {
    const dispatch = useDispatch();
    const tab = useSelector((state: RootState) => state.game.arcanumTab);
    return (
        <HeaderTabs
            tabs={TABS}
            active={tab}
            onSelect={(t) => dispatch(setArcanumTab(t))}
            label="Arcanum tabs"
            testId="arcanum-tabs"
        />
    );
};

export default ArcanumTabs;
