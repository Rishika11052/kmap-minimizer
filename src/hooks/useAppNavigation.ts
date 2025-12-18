import { useState, useCallback } from "react";
import type { ScreenType, OptionType } from "../types";

export function useAppNavigation() {
    const [screen, setScreen] = useState<ScreenType>("input");
    const [selectedOption, setSelectedOption] = useState<OptionType>("");

    const navigateToInput = useCallback(() => {
        setScreen("input");
    }, []);

    const navigateToOptions = useCallback(() => {
        setScreen("options");
    }, []);

    const navigateToResult = useCallback(() => {
        setScreen("result");
    }, []);

    const navigateToKMap = useCallback(() => {
        setScreen("KMAP");
    }, []);

    const navigateToVerilog = useCallback(() => {
        setScreen("verilog");
    }, []);

    const resetToInput = useCallback(() => {
        setScreen("input");
        setSelectedOption("");
    }, []);

    const selectOption = useCallback((option: "SOP" | "POS") => {
        setSelectedOption(option);
    }, []);

    return {
        screen,
        selectedOption,
        navigateToInput,
        navigateToOptions,
        navigateToResult,
        navigateToKMap,
        navigateToVerilog,
        resetToInput,
        selectOption,
    };
}
