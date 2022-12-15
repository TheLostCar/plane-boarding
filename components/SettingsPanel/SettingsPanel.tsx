import CheckboxInput from '@components/CheckboxInput';
import MinimizeIcon from '@components/MinimizeIcon';
import NumberInput from '@components/NumberInput';
import SelectInput from '@components/SelectInput';
import { ActionTypes, BoardingMethods, PlaneState, PlaneStateActions, PlayStates } from '@models/PlaneState.types';
import Image from 'next/image';
import { Dispatch, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import DraggableContainer from './DraggableContainer';
import styles from './SettingsPanel.module.scss'


const SettingsPanel = ({ planeState, dispatch }: { planeState: PlaneState, dispatch: Dispatch<PlaneStateActions> }) => {
    const [open, setOpen] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null)

    const onChange = useMemo(() => ({
        [ActionTypes.CHANGE_PLAY_STATE]: () => { dispatch({ type: ActionTypes.CHANGE_PLAY_STATE, value: PlayStates.PLAY }) },
        [ActionTypes.CHANGE_TOTAL_GROUPS]: (v: number) => dispatch({ type: ActionTypes.CHANGE_TOTAL_GROUPS, value: v }),
        [ActionTypes.CHANGE_BOARDING_METHOD]: (v: string) => { dispatch({ type: ActionTypes.CHANGE_BOARDING_METHOD, value: v as BoardingMethods }) },
        [ActionTypes.CHANGE_COLS]: (v: number) => dispatch({ type: ActionTypes.CHANGE_COLS, value: v }),
        [ActionTypes.CHANGE_ROWS]: (v: number) => dispatch({ type: ActionTypes.CHANGE_ROWS, value: v }),
        [ActionTypes.CHANGE_GROUPS_PER_COL]: (v: number) => dispatch({ type: ActionTypes.CHANGE_GROUPS_PER_COL, value: v }),
        [ActionTypes.CHANGE_GROUPS_PER_ROW]: (v: number) => dispatch({ type: ActionTypes.CHANGE_GROUPS_PER_ROW, value: v }),
        [ActionTypes.CHANGE_LARGE_GROUP_RATIO]: (v: number) => dispatch({ type: ActionTypes.CHANGE_LARGE_GROUP_RATIO, value: +(v / 100).toFixed(2) }),
        [ActionTypes.CHANGE_BASE_STOWING_TICKS]: (v: number) => dispatch({ type: ActionTypes.CHANGE_BASE_STOWING_TICKS, value: v }),
        [ActionTypes.CHANGE_BASE_WALK_SPEED]: (v: number) => dispatch({ type: ActionTypes.CHANGE_BASE_WALK_SPEED, value: v }),
        [ActionTypes.CHANGE_SHUFFLE_GROUP_MEMBERS]: (v: boolean) => dispatch({ type: ActionTypes.CHANGE_SHUFFLE_GROUP_MEMBERS, value: v }),
        [ActionTypes.CHANGE_RANDOM_STOW_TYPE]: (v: boolean) => dispatch({ type: ActionTypes.CHANGE_RANDOM_STOW_TYPE, value: v }),
        [ActionTypes.CHANGE_RANDOM_WALK_TYPE]: (v: boolean) => dispatch({ type: ActionTypes.CHANGE_RANDOM_WALK_TYPE, value: v }),
        [ActionTypes.CHANGE_REVERSE]: (v: boolean) => dispatch({ type: ActionTypes.CHANGE_REVERSE, value: v }),
        [ActionTypes.CHANGE_SIZE]: (v: number) => dispatch({ type: ActionTypes.CHANGE_SIZE, value: v }),
    }), [dispatch])

    const possibleValues = useMemo(() => {
        return Object.keys(BoardingMethods)
    }, [])

    const handleInput = useCallback(
        function (el: HTMLInputElement | HTMLButtonElement) {
            if (el.matches('.' + styles.alwaysActive)) return;
            if (planeState.playState === PlayStates.IDLE) {
                el.disabled = false
                el.classList.remove(styles.disabled)
                return
            }
            el.disabled = true
            el.classList.add(styles.disabled)
        }, [planeState.playState])


    useEffect(() => {
        const inputElements = containerRef.current?.querySelectorAll('input')
        const buttonElements = containerRef.current?.querySelectorAll('button')
        const labelElements = containerRef.current?.querySelectorAll('label');

        inputElements?.forEach(handleInput);
        buttonElements?.forEach(handleInput);
        labelElements?.forEach((el) => {
            if (planeState.playState === PlayStates.IDLE) return el.classList.remove(styles.disabled)
            el.classList.add(styles.disabled)
        })

    }, [planeState.playState, handleInput])

    const maxGroups = () => {
        const { rows, cols, largeGroupRatio } = planeState;
        const reversePyramidGroups = (rows * cols) / 2 - (Math.ceil(rows * largeGroupRatio) * 2) + 2
        switch (planeState.boardingMethod) {

            case BoardingMethods.BACK_TO_FRONT:
            case BoardingMethods.FRONT_TO_BACK:
            case BoardingMethods.ROTATING_ZONE:
                return rows

            case BoardingMethods.WILMA_STRAIGHT:
                return cols / 2

            case BoardingMethods.WILMA_BLOCK:
                return (cols / 2) * rows

            case BoardingMethods.RANDOM:
                return rows * cols

            case BoardingMethods.REVERSE_PYRAMID:
                if (reversePyramidGroups > 3) return reversePyramidGroups;
                else return 3

            case BoardingMethods.STEFFEN_PERFECT:
            case BoardingMethods.STEFFEN_MODIFIED:
                return cols * rows
        }
    }

    const minGroups = () => {
        switch (planeState.boardingMethod) {
            case BoardingMethods.WILMA_STRAIGHT:
                return planeState.cols / 2;
            case BoardingMethods.RANDOM:
                return 1;
            case BoardingMethods.REVERSE_PYRAMID:
                return 3;

            case BoardingMethods.STEFFEN_PERFECT:
            case BoardingMethods.STEFFEN_MODIFIED:
                return planeState.cols * planeState.rows
        }
        return 1;
    }


    const dragged = useRef(false);
    return (
        <DraggableContainer x={20} y={20}>
            <div ref={containerRef} className={styles.wrapper}>

                <button
                    className={`${styles.hamburger} ${styles.alwaysActive} ${!open && styles.hamburgerVisible || ''}`}

                    onMouseDown={() => dragged.current = false}
                    onMouseMove={() => dragged.current = true}
                    onMouseUp={() => {
                        if (dragged.current === true) return;
                        setOpen(s => !s)
                    }}
                >
                    <div style={{ width: '100%' }}>
                        <Image
                            draggable={false}
                            src={'/hamburger.svg'}
                            layout='responsive'
                            height={100} width={100}
                            alt='menu icon'
                        />

                    </div>
                </button>
                <div className={`${styles.edge} ${!open && styles.closed || ''}`}>

                    <div className={`${styles.background} ${!open && styles.closed || ''}`}>

                        <div className={styles.row}>
                            <h2>Settings</h2>
                            <button
                                className={`${styles.minimize} ${styles.alwaysActive}  ${!open && styles.closed || ''}`}
                                title='minimize menu'
                                onMouseDown={() => dragged.current = false}
                                onMouseMove={() => dragged.current = true}
                                onMouseUp={() => {
                                    if (dragged.current === true) return;
                                    setOpen(s => !s)
                                }}
                            >
                                <MinimizeIcon />
                            </button>
                        </div>

                        <div className={styles.row}>
                            <SelectInput
                                displayValues={Object.keys(BoardingMethods).map((v) => v.split('_').join(' ').toLowerCase())}
                                defaultValue={Object.keys(BoardingMethods).findIndex((v) => v === BoardingMethods.BACK_TO_FRONT)}
                                possibleValues={possibleValues}
                                onChange={onChange.CHANGE_BOARDING_METHOD}
                            />
                        </div>

                        <div className={styles.row}>

                            <NumberInput
                                name='rows'
                                label='Rows'
                                step={1}
                                min={1}
                                onChange={onChange.CHANGE_ROWS}
                                defaultValue={planeState.rows}
                            />

                            <NumberInput
                                name='cols'
                                label='Cols'
                                step={2}
                                min={2}
                                onChange={onChange.CHANGE_COLS}
                                defaultValue={planeState.cols}
                            />
                        </div>

                        <div className={styles.row}>
                            {
                                planeState.boardingMethod !== BoardingMethods.WILMA_BLOCK

                                &&

                                <NumberInput
                                    name='groups'
                                    label='Groups'
                                    step={1}
                                    min={minGroups()}
                                    max={maxGroups()}
                                    onChange={onChange.CHANGE_TOTAL_GROUPS}
                                    defaultValue={planeState.totalGroups}
                                />

                                ||

                                <>
                                    <NumberInput
                                        name='groupsPerCol'
                                        label='Groups V'
                                        title='Vertical Groups'
                                        step={1}
                                        min={1}
                                        max={planeState.cols / 2}
                                        onChange={onChange.CHANGE_GROUPS_PER_COL}
                                        defaultValue={planeState.groupsPerCol}
                                    />


                                    <NumberInput
                                        name='groupsPerRow'
                                        label='Groups H'
                                        title='Horizontal Groups'
                                        step={1}
                                        min={1}
                                        max={planeState.rows}
                                        onChange={onChange.CHANGE_GROUPS_PER_ROW}
                                        defaultValue={planeState.groupsPerRow}
                                    />
                                </>
                            }
                        </div>

                        {
                            planeState.boardingMethod === BoardingMethods.REVERSE_PYRAMID

                            &&

                            <div className={styles.row}>
                                <NumberInput
                                    name='largeGroupRatio'
                                    label='First/Last Group Ratio %'
                                    step={1}
                                    min={10}
                                    max={100}
                                    onChange={onChange.CHANGE_LARGE_GROUP_RATIO}
                                    defaultValue={+(planeState.largeGroupRatio * 100).toFixed(2)}
                                />
                            </div>
                        }

                        <div className={styles.row}>
                            <NumberInput
                                name='size'
                                label='Size'
                                step={1}
                                min={25}
                                max={200}
                                onChange={onChange.CHANGE_SIZE}
                                defaultValue={planeState.size}
                            />
                        </div>

                        <div className={styles.row}>
                            <NumberInput
                                name='baseWalkSpeed'
                                label='Walk Speed'
                                title='Base Walk Speed - in pixels per second'
                                step={1}
                                min={1}
                                max={50}
                                onChange={onChange.CHANGE_BASE_WALK_SPEED}
                                defaultValue={planeState.baseWalkSpeed}
                            />

                            <NumberInput
                                name='baseStowTicks'
                                label='Stow Speed'
                                title='Base Stow Ticks - number of updates to complete stowing'
                                step={1}
                                min={10}
                                max={100}
                                onChange={onChange.CHANGE_BASE_STOWING_TICKS}
                                defaultValue={planeState.baseStowingTicks}
                            />

                        </div>


                        <div className={`${styles.row} ${styles.marginTopAuto}`}>

                            <div className={styles.col}>
                                <CheckboxInput
                                    defaultState={planeState.shuffleGroupMembers}
                                    onChange={onChange.CHANGE_SHUFFLE_GROUP_MEMBERS}
                                    name='Shuffle Subarray'
                                />
                                <CheckboxInput
                                    defaultState={false}
                                    onChange={onChange.CHANGE_REVERSE}
                                    name='Reverse Subarray'
                                />

                                <CheckboxInput
                                    defaultState={planeState.randomStowType}
                                    name='Randomize Stow'
                                    onChange={onChange.CHANGE_RANDOM_STOW_TYPE}
                                />
                                <CheckboxInput
                                    name='Randomize Walk'
                                    defaultState={planeState.randomWalkType}
                                    onChange={onChange.CHANGE_RANDOM_WALK_TYPE}
                                />
                            </div>
                        </div>





                        <div className={`${styles.row} ${styles.marginTopAuto}`}>

                            <button
                                className={`${styles.controlButton} ${styles.alwaysActive}`}
                                onPointerDown={e => e.stopPropagation()}
                                onClick={() => {
                                    dispatch({ type: ActionTypes.CHANGE_PLAY_STATE, value: PlayStates.PLAY })
                                }}
                            >
                                Start
                            </button>

                            <button
                                className={`${styles.controlButton} ${styles.alwaysActive}`}
                                onPointerDown={e => e.stopPropagation()}
                                onClick={() => { if (planeState.playState === PlayStates.PLAY) dispatch({ type: ActionTypes.CHANGE_PLAY_STATE, value: PlayStates.PAUSED }) }}
                            >
                                Pause
                            </button>

                            <button
                                className={`${styles.controlButton} ${styles.alwaysActive}`}
                                onPointerDown={e => e.stopPropagation()}
                                onClick={() => { dispatch({ type: ActionTypes.CHANGE_PLAY_STATE, value: PlayStates.IDLE }) }}
                            >
                                Stop
                            </button>

                        </div>

                    </div>
                </div>

            </div>
        </DraggableContainer>
    );
}

export default SettingsPanel;