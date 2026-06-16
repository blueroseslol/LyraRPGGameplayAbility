# Lyra项目结构与模块逻辑

## 1. Project Structure

- `Source/`
    - `LyraGame` (Runtime) — 游戏核心，详见 [[#2. Module Logic|Module Logic]]
        - [[#1. GAS (Gameplay Ability System)|GAS]]
            - ASC：玩家/全局两层，管理能力激活、输入、动态标签 GE
            - AbilitySet：打包授予数据资产，含能力 + GE + AttributeSet
            - GameplayAbility：激活策略（OnInput/WhileInput/OnSpawn）+ 激活组互斥
            - AttributeSet：HealthSet、CombatSet，服务器修改、OnRep 同步
            - GameplayEffect：DamageExecution、HealExecution 计算
            - GameplayCue：网络同步特效/音效，GameFeature 动态注册路径
            - GamePhase：全局 ASC 上的阶段能力，父子能力自动取消
            - AbilityCost：InventoryItem/ItemTagStack/PlayerTagStack 消耗检查
        - [[#2. Equipment & Weapons|Equipment & Weapons]]
            - EquipmentDefinition：数据资产，定义 AbilitySet + Actor + 外观
            - EquipmentInstance：运行时实例，持有 SpawnedActors
            - EquipmentManagerComponent：Pawn 上管理装备增删，调用 GiveToAbilitySystem
            - WeaponInstance：武器状态（弹药、热度）
            - RangedWeaponInstance：远程武器散布/弹道逻辑
            - WeaponSpawner：武器生成器 Actor
            - WeaponStateComponent：屏幕命中标记、命中标记 Replication
            - RangedWeapon Ability：远程开枪（TargetData + 碰撞）+ 瞄准源
            - PickupDefinition：拾取物/武器拾取数据资产
        - [[#3. Inventory|Inventory]]
            - InventoryItemDefinition：物品定义 + 可扩展 Fragment 子类
            - InventoryItemInstance：运行时实例 + GameplayTagStack 堆叠
            - InventoryManagerComponent：PlayerController 上，FastArray 服务器权威管理
            - QuickBarComponent：快捷栏，管理装备槽位 + 消息通知
            - InventoryFragment 子类：EquippableItem/PickupIcon/QuickBarIcon/SetStats/ReticleConfig
            - IPickupable：可拾取接口 + 拾取模板/实例/统计工具
            - InventoryFunctionLibrary：库存蓝图函数库
        - [[#4. Input|Input]]
            - InputConfig：InputAction → GameplayTag 映射资产
            - InputComponent：EnhancedInput 扩展，BindAbilityActions
            - HeroComponent：DataInitialized 时绑定增强输入 → ASC 桥接
            - PlayerInput：EnhancedPlayerInput 子类
            - PlayerMappableKeyProfile：玩家可改建设置
            - InputModifiers：DeadZone/GamepadSensitivity/AimInversion
            - AimSensitivityData：瞄准灵敏度数据资产
            - InputUserSettings/MappableKeySettings：输入用户设置
        - [[#5. Camera|Camera]]
            - CameraMode：模式基类（视野、混合权重/时间/函数、Stack）
            - CameraComponent：角色相机组件，管理模式栈
            - CameraMode_ThirdPerson：第三人称模式
            - CameraAssistInterface：相机辅助接口
            - PenetrationAvoidanceFeeler：穿模规避探测
            - PlayerCameraManager：继承 APlayerCameraManager
            - UICameraManagerComponent：UI 相机管理组件
        - [[#6. Character|Character]]
            - PawnExtensionComponent：协调 Feature 组件初始化顺序 + InitState
            - HeroComponent：输入绑定 + 相机模式覆盖 + 能力相机
            - HealthComponent：监听 HealthSet，死亡状态枚举，广播死亡事件
            - CharacterMovementComponent：自定义移动（GroundInfo 序列化）
            - Character/CharacterWithAbilities：角色子类 + 预配置能力
            - PawnData：Pawn 数据资产（默认相机、能力集、输入配置等）
            - Pawn：非角色 Pawn 基类
        - [[#7. GameMode & Experience|GameMode & Experience]]
            - GameMode：选择 Experience 并触发加载
            - GameState：实现 IAbilitySystemInterface，持有全局 ASC
            - ExperienceDefinition：声明 GameFeature 插件 + PawnData + Action
            - ExperienceActionSet：可复用的 Action 组合
            - ExperienceManagerComponent：GameState 上驱动加载状态机
            - ExperienceManager：EngineSubsystem，PIE 插件引用计数
            - UserFacingExperienceDefinition：面向用户的 Experience 元数据
            - WorldSettings：地图级别 Experience 默认值
            - AsyncAction_ExperienceReady：蓝图异步等 Experience 就绪
            - BotCreationComponent：机器人创建组件
        - [[#8. GameFeature|GameFeature]]
            - AddAbilities：向目标 Actor 注入能力/属性集/AbilitySet（服务器执行）
            - AddWidgets：向 HUD 插槽注入 UI Widget
            - AddInputContextMapping：动态添加 IMC
            - AddInputBinding：动态添加输入绑定配置
            - AddGameplayCuePath：注册 Cue 搜索路径
            - SplitscreenConfig：配置分屏参数
            - WorldActionBase：世界作用域 Action 抽象基类
            - GameFeaturePolicy/HotfixManager：GameFeature 策略与热更管理
        - [[#9. UI|UI]]
            - HUD/HUDLayout：HUD 与布局 Widget
            - UIExtension：GameplayTag 键控 UI 插槽，插件驱动组合
            - IndicatorSystem：世界空间指示器（血条/标记）+ 指示器描述符/投影
            - Foundation Widgets：ActionWidget/ButtonBase/ConfirmationScreen
            - Common Widgets：BoundActionButton/ListView/TabList/WidgetFactory
            - Weapon UI：ReticleWidget/HitMarker/CircumferenceMarker
            - LoadingScreenSubsystem：加载屏幕 UI 子系统
            - UIManagerSubsystem/UIMessaging：UI 管理与消息
            - Frontend：FrontendStateComponent/LobbyBackground
            - ActivatableWidget/GameViewportClient/TaggedWidget 等
        - [[#10. Teams|Teams]]
            - TeamSubsystem：WorldSubsystem 查询/比较队伍归属
            - TeamInfoBase/PublicInfo/PrivateInfo：队伍信息 Actor 层次
            - TeamAgentInterface：Character/PlayerState/Controller 实现
            - TeamDisplayAsset：队伍展示资产（颜色/图标）
            - TeamCreationComponent：队伍创建组件
            - TeamStatics/TeamCheats：队伍蓝图工具/作弊器
            - AsyncAction_ObserveTeam/Colors：异步观察队伍/颜色变化
        - [[#11. System|System]]
            - GameInstance：游戏生命周期、加密令牌、Session 权限
            - AssetManager：资产加载/缓存、Bundle 管理、启动任务
            - GameData：全局数据资产（伤害/治疗/动态标签 GE 软引用）
            - ReplicationGraph：Actor 复制分类、空间网格化、连接级策略
            - ReplicationGraphNode：AlwaysRelevant_ForConnection、PlayerStateFrequencyLimiter
            - GameplayTagStack：Tag 堆叠容器，FastArray 网络复制
            - GameEngine：GameEngine 子类，Init 注入自定义逻辑
            - GameSession：会话 Actor，重写自动登录/比赛开始结束
            - SignificanceManager：基于距离/可见性调整 Actor 更新频率
            - ActorUtilities/DevelopmentStatics/SystemStatics：辅助工具类
        - [[#12. Interaction|Interaction]]
            - IInteractableTarget：可交互目标接口，GatherInteractionOptions
            - IInteractionInstigator：交互发起者接口，仲裁多选项
            - FInteractionOption：交互选项（文本、能力、目标 ASC、UI 控件）
            - FInteractionQuery：交互查询（Pawn、Controller、附加数据）
            - InteractionStatics：蓝图工具库，从 Actor/Overlap/Hit 提取接口
            - GameplayAbility_Interact：交互能力实现
            - GameplayAbilityTargetActor_Interact：交互目标 Actor
            - AbilityTask_GrantNearbyInteraction：附近交互授权 Task
            - AbilityTask_WaitForInteractableTargets：等待可交互目标 Task
            - AbilityTask_WaitForInteractableTargets_SingleLineTrace：线迹等待 Task
            - LyraInteractionDurationMessage：交互持续时间消息
        - [[#13. Messages|Messages]]
            - FLyraVerbMessage：通用动词消息（Instigator-Verb-Target-Context-Magnitude）
            - FLyraVerbMessageReplication：FastArray 网络复制容器
            - FLyraVerbMessageReplicationEntry：单条消息复制条目
            - UGameplayMessageProcessor：服务端消息处理器基类
            - FLyraNotificationMessage：通知消息（目标玩家、频道、文本、标签）
            - ULyraVerbMessageHelpers：蓝图工具库，VerbMessage ↔ GameplayCueParameters
        - [[#14. Audio|Audio]]
            - AudioMixEffectsSubsystem：World 级混音，HDR/LDR 效果链切换、控制总线
            - FLyraAudioSubmixEffectsChain：Submix 效果链定义
            - AudioSettings：默认/加载/用户控制总线、音量总线、效果链映射
            - FLyraSubmixEffectChainMap：Submix → Preset 数组映射
        - [[#15. Cosmetics|Cosmetics]]
            - PawnComponent_CharacterParts：Pawn 端部件，FastArray 复制，生成 Actor
            - ControllerComponent_CharacterParts：Controller 端，拥有 Pawn 时附加部件
            - FLyraCharacterPart：部件定义（Actor 类、Socket、碰撞模式）
            - FLyraCharacterPartHandle：部件句柄，用于移除
            - FLyraAnimLayerSelectionSet：标签匹配 AnimLayer（首条胜出）
            - FLyraAnimBodyStyleSelectionSet：标签匹配 SkeletalMesh + 物理资产
            - CosmeticCheats：控制台增删替换装饰
            - CosmeticDeveloperSettings：PIE 下装饰作弊配置
        - [[#16. Feedback|Feedback]]
            - ContextEffectsSubsystem：标签上下文 VFX/SFX 生成
            - ContextEffectsLibrary/Set：效果库/集合资产
            - ContextEffectComponent：Actor 上下文效果组件
            - ContextEffectsInterface：效果上下文接口
            - AnimNotify_LyraContextEffects：动画通知触发表面效果
            - NumberPopComponent：伤害/治疗浮动数字
            - NumberPopComponent_MeshText：Mesh 文本数字弹窗（缓存池）
            - NumberPopComponent_NiagaraText：Niagara 文本数字弹窗
            - DamagePopStyle/StyleNiagara：伤害弹窗样式资产
        - [[#17. Performance|Performance]]
            - PerformanceStatSubsystem：GameInstance 级，FPS/Ping/丢包/Latency 统计
            - FLyraPerformanceStatCache：帧观察者，环形缓冲记录
            - PerformanceSettings：桌面帧率限制、统计组配置
            - PlatformSpecificRenderingSettings：设备配置、帧率模式、画质选项
            - FLyraQualityDeviceProfileVariant：画质等级/设备配置变体
            - ELyraDisplayablePerformanceStat：FPS/ServerFPS/FrameTime 等枚举
            - ELyraStatDisplayMode：隐藏/文本/图表/文本与图表
        - [[#18. Settings|Settings]]
            - SettingsLocal：UGameUserSettings 子类，帧率/画质/音量/HDR/安全区
            - SettingsShared：ULocalPlayerSaveGame，色盲/手柄/字幕/灵敏度/语言
            - GameSettingRegistry：注册视频/音频/游戏/键鼠/手柄设置页面
            - CustomSettings 子类：SafeZone/ActionSafeZone/KeyboardInput/AudioOutput/Language/OverallQuality/PerfStat/Resolution/MobileFPS
            - Screens：BrightnessEditor/SafeZoneEditor
            - Widgets：SettingsListEntrySetting_KeyboardInput
        - [[#19. Physics|Physics]]
            - LyraCollisionChannels：Interaction/Weapon 等专用 Trace Channel 宏
            - UPhysicalMaterialWithTags：带 GameplayTag 的物理材质
        - [[#20. Replays|Replays]]
            - ReplaySubsystem：GameInstance 级，播放/录制/清理/跳转
            - ReplayListEntry：录像条目，封装名称/时间戳/时长/观众数
            - ReplayList：录像列表容器
            - AsyncAction_QueryReplays：异步查询录像列表蓝图动作
    - `LyraEditor` (Editor) — 编辑器扩展：验证器、资产工厂、内容校验 Commandlet
- `Plugins/`
    - [[#21. ModularGameplayActors|ModularGameplayActors]] — 模块化基类（ACharacter、APlayerController、AGameMode 等），重写 `PreInitializeComponents`/`EndPlay`，使 GameFeature 可动态注入/移除组件
    - [[#22. CommonGame|CommonGame]] — 核心游戏框架：`UCommonGameInstance`（用户/Session 管理）、`UCommonLocalPlayer`（Pawn/Controller/PlayerState 生命周期委托）、`UPrimaryGameLayout`（多层 UI Layer 栈）、`ACommonPlayerController`
    - [[#23. CommonUser|CommonUser]] — 用户身份与登录子系统：`UCommonUserSubsystem` 管理本地多人登录、在线认证、平台权限检查、访客用户、分屏输入映射
    - [[#24. CommonLoadingScreen|CommonLoadingScreen]] — `ULoadingScreenManager`（GameInstanceSubsystem），在场景切换和异步加载过程中显示加载界面，支持 `ILoadingProcessInterface` 扩展加载等待条件
    - [[#25. UIExtension|UIExtension]] — [[#9. UI|UI]] 扩展点系统：`UUIExtensionSubsystem` 以 GameplayTag 为 Key 管理 UI 插槽，GameFeature 可向命名插槽动态注册/注销 Widget
    - [[#26. GameplayMessageRouter|GameplayMessageRouter]] — [[#13. Messages|Messages]] 消息总线：`UGameplayMessageSubsystem`（GameInstanceSubsystem），以 GameplayTag 为 Channel 的发布/订阅消息总线，C++ 类型安全广播 + 蓝图异步节点
    - [[#27. GameSettings|GameSettings]] — [[#18. Settings|Settings]] 分层设置框架：`UGameSettingRegistry` 管理 `ULocalPlayer` 的顶层设置，派生离散值/标量/动态值，支持编辑条件、标签筛选、依赖关系
    - [[#28. GameSubtitles|GameSubtitles]] — `USubtitleDisplaySubsystem`（GameInstanceSubsystem），运行时字幕显示，通过 `USubtitleDisplayOptions` 配置字体/字号/颜色/边框/背景不透明度
    - [[#29. AsyncMixin|AsyncMixin]] — 零开销 C++ Mixin（`FAsyncMixin`/`FAsyncScope`），异步加载请求序列化执行，保证回调顺序，支持自定义完成条件，自动安全捕获 `[this]`
    - [[#30. PocketWorlds|PocketWorlds]] — `UPocketLevelSubsystem`（WorldSubsystem），按 `ULocalPlayer` 动态流式加载私有子关卡，适用于角色预览、自定义场景、隔离教程空间
    - [[#31. LyraExampleContent|LyraExampleContent]] — 纯内容插件，提供 Lyra 示例项目的地图、蓝图、数据资产等示例内容
    - `GameFeatures/` — 游戏功能插件容器，详见 [[Lyra GameFeature]]
        - `ShooterCore` (C++ + Content) — 射击核心：瞄准辅助、积分、消灭链、控制点，含多个 Experience 资产
        - `ShooterExplorer` (Content Only) — 探索模式蓝图与内容资产
        - `ShooterMaps` (Content Only) — 射击地图资产
        - `ShooterTests` (C++ + Content) — 射击自动化测试
        - `TopDownArena` (C++ + Content) — 俯视角竞技场：自定义 AttributeSet、相机模式、移动组件
- `Content/` — 蓝图、地图、资产
- `Config/` — 引擎与项目配置（.ini），含多平台（Android/iOS/Linux/Mac/Windows）及在线服务（EOS/Steam）子配置
- `LyraStarterGame.uproject` — 项目描述文件，声明模块与 ~55 个启用的引擎插件

---

## 2. Module Logic

### 1. GAS (Gameplay Ability System)

- `ULyraAbilitySystemComponent` — 玩家/全局两层 ASC，管理激活组（Independent/Exclusive_Replaceable/Exclusive_Blocking）、输入绑定（AbilityInputTagPressed/Released）、动态标签 GE、TagRelationshipMapping
- `ULyraAbilitySet` — `UPrimaryDataAsset`，打包授予容器，含 `FLyraAbilitySet_GameplayAbility`/`GameplayEffect`/`AttributeSet` 三个列表，`GiveToAbilitySystem`/`TakeFromAbilitySystem`
- `ULyraGameplayAbility` — 能力基类，激活策略（OnInputTriggered/WhileInputActive/OnSpawn）+ 激活组
- `ULyraGameplayAbility_Death` — 死亡能力
- `ULyraGameplayAbility_Jump` — 跳跃能力
- `ULyraGameplayAbility_Reset` — 重置能力，发送 `FLyraPlayerResetMessage`
- `ULyraAttributeSet` — 属性集基类，含通用宏和委托
- `ULyraHealthSet` — Health、MaxHealth、Healing(m)、Damage(m)，OnHealthChanged/OnOutOfHealth 委托
- `ULyraCombatSet` — BaseDamage、BaseHeal
- `ULyraDamageExecution` — 伤害执行计算，读取 CombatSet.BaseDamage + SetByCaller，输出到 HealthSet.Damage
- `ULyraHealExecution` — 治疗执行计算
- `ULyraAbilitySystemGlobals` — 分配自定义 `FLyraGameplayEffectContext`（含 CartridgeID）
- `ULyraGameplayCueManager` — GameplayCue 异步加载管理
- `ULyraGlobalAbilitySystem`（WorldSubsystem）— 全局能力/效果批量应用到所有注册 ASC
- `ULyraGamePhaseAbility` — 阶段能力基类，在全局 ASC 上运行，支持阶段取消/替换
- `ULyraGamePhaseSubsystem`（WorldSubsystem）— 阶段管理，StartPhase/WhenPhaseStartsOrIsActive/WhenPhaseEnds
- `ULyraAbilityTagRelationshipMapping` — `UPrimaryDataAsset`，配置 Tag 间阻断/取消关系
- `ULyraAbilityCost` — 能力消耗基类
- `ULyraAbilityCost_InventoryItem` — 消耗背包物品
- `ULyraAbilityCost_ItemTagStack` — 消耗 TagStack 数量
- `ULyraAbilityCost_PlayerTagStack` — 消耗玩家 TagStack
- `FLyraGameplayEffectContext` — 扩展 EffectContext，含 CartridgeID
- `FLyraGameplayAbilityTargetData_SingleTargetHit` — 扩展 TargetData，含 CartridgeID
- `ALyraTaggedActor` — 带 GameplayTag 容器的基础 Actor
- `ILyraAbilitySourceInterface` — 能力来源接口
- `FLyraAbilitySimpleFailureMessage` — 能力失败消息
- `FLyraAbilityMontageFailureMessage` — 蒙太奇播放失败消息

### 2. Equipment & Weapons

- `ULyraEquipmentDefinition` — 数据资产，定义 `AbilitySetsToGrant` + `ActorsToSpawn` + 外观
- `ULyraEquipmentInstance` — 运行时实例，持有 SpawnedActors 引用，OnEquipped/OnUnequipped
- `ULyraEquipmentManagerComponent` — Pawn 上，管理 `FLyraEquipmentList`（FastArray），EquipItem/UnequipItem
- `ULyraWeaponInstance` — 继承 EquipmentInstance，记录弹药、热度等武器状态
- `ULyraRangedWeaponInstance` — 远程武器，散布/弹道逻辑、射速、弹药消耗
- `ALyraWeaponSpawner` — 武器生成器 Actor
- `ULyraWeaponStateComponent` — 命中标记组件，`FLyraScreenSpaceHitLocation` + `FLyraServerSideHitMarkerBatch`
- `ULyraGameplayAbility_FromEquipment` — 能力基类，从 ASC 获取当前装备实例
- `ULyraGameplayAbility_RangedWeapon` — 远程武器能力，开枪 TargetData + 碰撞检测，`ELyraAbilityTargetingSource`
- `ULyraPickupDefinition` — 拾取物定义数据资产
- `ULyraWeaponPickupDefinition` — 武器拾取物定义
- `ULyraQuickBarComponent` — 快捷栏，管理装备槽位，`FLyraQuickBarSlotsChangedMessage`/`ActiveIndexChangedMessage`
- `ULyraDamageLogDebuggerComponent` — 伤害日志调试组件

### 3. Inventory

- `ULyraInventoryItemDefinition` — 物品定义（`UPrimaryDataAsset`），包含多个 `ULyraInventoryItemFragment` 子类
- `ULyraInventoryItemFragment` — 物品片段抽象基类
- `UInventoryFragment_EquippableItem` — 可装备物品片段
- `UInventoryFragment_PickupIcon` — 拾取图标片段
- `UInventoryFragment_QuickBarIcon` — 快捷栏图标片段
- `UInventoryFragment_SetStats` — 统计设置片段
- `ULyraInventoryItemInstance` — 运行时物品实例，带 `FGameplayTagStackContainer` 堆叠
- `ULyraInventoryManagerComponent` — PlayerController 上，`FLyraInventoryList`（FastArray），服务器权威，增删查
- `FLyraInventoryChangeMessage` — 库存变更消息
- `IPickupable` — 可拾取接口，含 `FPickupTemplate`/`FPickupInstance`/`FInventoryPickup`，`UPickupableStatics` 蓝图工具
- `ULyraInventoryFunctionLibrary` — 库存蓝图函数库

### 4. Input

- `ULyraInputConfig` — `UPrimaryDataAsset`，`FLyraInputAction` 数组（InputAction → GameplayTag 映射）
- `ULyraInputComponent` — 继承 `UEnhancedInputComponent`，`BindAbilityActions`（InputAction 绑定 Press/Release 回调）
- `ULyraPlayerInput` — `UEnhancedPlayerInput` 子类
- `ULyraHeroComponent` — DataInitialized 时调用 `InitializePlayerInput`，建立增强输入 → ASC Tag 桥接
- `ULyraPlayerMappableKeyProfile` — 玩家可改键配置
- `ULyraPlayerMappableKeySettings` — 可改键设置
- `ULyraInputUserSettings` — 输入用户设置
- `ULyraAimSensitivityData` — 瞄准灵敏度数据资产
- `ULyraSettingBasedScalar` — 基于设置的标量修饰符
- `ULyraInputModifierDeadZone` — 死区修饰符，`EDeadzoneStick` 枚举
- `ULyraInputModifierGamepadSensitivity` — 手柄灵敏度修饰符，`ELyraTargetingType` 枚举
- `ULyraInputModifierAimInversion` — 瞄准反转修饰符

### 5. Camera

- `ULyraCameraMode` — 模式基类（FOV、混合权重/时间、`ELyraCameraModeBlendFunction`），`FLyraCameraModeView`
- `ULyraCameraModeStack` — 相机模式栈，混合管理
- `ULyraCameraComponent` — 角色相机组件，管理激活模式栈
- `ULyraCameraMode_ThirdPerson` — 第三人称相机模式
- `ALyraPlayerCameraManager` — 处理相机穿模规避
- `FLyraPenetrationAvoidanceFeeler` — 穿模规避探测结构
- `ILyraCameraAssistInterface` — 相机辅助接口
- `ULyraUICameraManagerComponent` — UI 相机管理组件

### 6. Character

- `ULyraPawnExtensionComponent` — 协调所有 Feature 组件初始化顺序 + `IGameFrameworkInitStateInterface`，管理 InitState 转换
- `ULyraHeroComponent` — 输入绑定 + `AbilityCameraMode` 覆盖 + `DetermineCameraMode` 委托
- `ULyraHealthComponent` — 监听 `ULyraHealthSet` 属性变化，`ELyraDeathState` 枚举，广播死亡事件
- `ALyraCharacter` — 主角色类，`FLyraReplicatedAcceleration` + `FSharedRepMovement`
- `ALyraCharacterWithAbilities` — 预配置能力的角色子类
- `ALyraPawn` — 非角色 Pawn 基类（APawn 子类，非 ACharacter）
- `ULyraCharacterMovementComponent` — 自定义移动组件，`FLyraCharacterGroundInfo` 序列化
- `ULyraPawnData` — `UPrimaryDataAsset`，默认相机模式、能力集、输入配置、装备等

### 7. GameMode & Experience

- `ALyraGameMode` — 游戏模式，`InitGame` 中根据地图/命令行选择 Experience
- `ALyraGameState` — 实现 `IAbilitySystemInterface`，持有全局 ASC
- `ULyraExperienceDefinition` — `UPrimaryDataAsset`（Const），`GameFeaturesToEnable` + `DefaultPawnData` + `Actions` + `ActionSets`
- `ULyraExperienceActionSet` — `UPrimaryDataAsset`（NotBlueprintable），可复用 Action 组合 + GameFeaturesToEnable
- `ULyraExperienceManagerComponent`（UGameStateComponent）— 驱动加载状态机，`CurrentExperience` 通过 OnRep 同步客户端，三阶段委托（HighPriority/Normal/LowPriority）
- `ULyraExperienceManager`（UEngineSubsystem）— PIE 下 GameFeature 插件 FILO 引用计数管理
- `ULyraUserFacingExperienceDefinition` — `UPrimaryDataAsset`，面向用户的 Experience 元数据（名称、描述、图标）
- `ALyraWorldSettings` — 地图级别 `DefaultGameplayExperience` 主资产 ID
- `UAsyncAction_ExperienceReady` — 蓝图异步等待 Experience 就绪
- `ULyraBotCreationComponent` — 机器人创建组件

### 8. GameFeature

- `UGameFeatureAction_AddAbilities` — 向指定 Actor 注入 `FLyraAbilityGrant` + `FLyraAttributeSetGrant` + AbilitySet（仅服务器），监听 `LyraAbilityReady`/`ExtensionAdded`
- `UGameFeatureAction_AddWidgets` — 向 HUD 注入 `FLyraHUDElementEntry`（ExtensionPointTag + WidgetClass + Priority）
- `UGameFeatureAction_AddInputContextMapping` — 动态添加 `FInputMappingContextAndPriority` IMC
- `UGameFeatureAction_AddInputBinding` — 动态添加 `ULyraInputConfig` 输入绑定
- `UGameFeatureAction_AddGameplayCuePath` — 注册 GameplayCue 搜索目录
- `UGameFeatureAction_SplitscreenConfig` — 配置分屏参数
- `UGameFeatureAction_WorldActionBase`（abstract）— 抽象基类，注册 `OnStartGameInstance` → `AddToWorld`
- `ULyraGameFeaturePolicy` — GameFeature 策略
- `ULyraGameFeature_HotfixManager` — GameFeature 热更管理器
- `ULyraGameFeature_AddGameplayCuePaths` — GameplayCue 路径注册（GameFeaturePolicy 关联）

### 9. UI

- `ALyraHUD` — HUD 主类，持有 HUDLayout
- `ULyraHUDLayout` — HUD 布局 Widget，定义 UI Layer Extension Point
- `ULyraActivatableWidget` — 激活式 Widget 基类，`ELyraWidgetInputMode` 输入模式
- `ULyraGameViewportClient` — GameViewportClient 子类
- `ULyraActionWidget` — 动作 Widget
- `ULyraButtonBase` — 按钮基类
- `ULyraConfirmationScreen` — 确认弹窗
- `ULyraControllerDisconnectedScreen` — 控制器断开提示
- `ULyraBoundActionButton` — 绑定动作按钮
- `ULyraListView` — 列表视图
- `ULyraTabListWidgetBase` / `ILyraTabButtonInterface` / `ULyraTabButtonBase` — Tab 列表组件
- `ULyraWidgetFactory` / `ULyraWidgetFactory_Class` — Widget 工厂
- `ULyraIndicatorManagerComponent` — 世界空间指示器管理器
- `UIndicatorDescriptor` — 指示器描述符，`FIndicatorProjection` + `EActorCanvasProjectionMode`
- `UIndicatorLayer` / `UIndicatorLibrary` / `SActorCanvas` / `IIndicatorWidgetInterface` — 指示器完整系统
- `UCircumferenceMarkerWidget` / `SCircumferenceMarkerWidget` — 环绕标记
- `UHitMarkerConfirmationWidget` / `SHitMarkerConfirmationWidget` — 命中确认标记
- `ULyraReticleWidgetBase` — 准星基类
- `ULyraWeaponUserInterface` — 武器 UI 接口
- `ULyraLoadingScreenSubsystem` — 加载屏幕 UI 子系统
- `ULyraUIManagerSubsystem` — UI 管理子系统
- `ULyraUIMessaging` — UI 消息通信
- `ULyraFrontendStateComponent` / `ULyraLobbyBackground` — 前端大厅
- `UApplyFrontendPerfSettingsAction` — 前端性能设置
- `ULyraPerfStatWidgetBase` / `ULyraPerfStatContainerBase` / `SLyraLatencyGraph` / `ULyraPerfStatGraph` — 性能统计 UI
- `ULyraSettingScreen` / `ULyraTaggedWidget` / `ULyraJoystickWidget` / `ULyraSimulatedInputWidget` / `ULyraTouchRegion` / `UMaterialProgressBar`

### 10. Teams

- `ULyraTeamSubsystem`（WorldSubsystem）— `CompareTeams`/`FindTeamFromObject`/`CanCauseDamage`，`ELyraTeamComparison` 枚举
- `ALyraTeamInfoBase` — 队伍信息基类 Actor
- `ALyraTeamPublicInfo` — 队伍公开信息（名称、颜色等），GameState Replicated
- `ALyraTeamPrivateInfo` — 队伍私密信息（仅队伍成员 Replicated）
- `ILyraTeamAgentInterface` — Character/PlayerState/Controller 实现，`GetGenericTeamId`/`GetTeamIndex`
- `ULyraTeamDisplayAsset` — 队伍展示资产（颜色、图标等）
- `ULyraTeamCreationComponent` — 队伍创建组件
- `ULyraTeamStatics` — 队伍蓝图工具函数库
- `ULyraTeamCheats` — 队伍控制台作弊命令
- `UAsyncAction_ObserveTeam` — 异步观察队伍变化蓝图动作
- `UAsyncAction_ObserveTeamColors` — 异步观察队伍颜色变化蓝图动作

### 11. System

- `ULyraGameInstance` — 游戏实例，管理生命周期、加密令牌、Session 加入权限
- `ULyraAssetManager` — 资产管理器子类，Bundle 管理、启动任务调度（`FLyraAssetManagerStartupJob`）、默认 PawnData、`FLyraBundles` 定义
- `ULyraGameData` — 全局游戏数据资产（`UPrimaryDataAsset`），伤害/治疗/动态标签等默认 GE 软引用
- `ULyraReplicationGraph` — Actor 网络相关性分类、空间网格化、连接级复制策略
- `ULyraReplicationGraphNode_AlwaysRelevant_ForConnection` — 按连接始终相关节点，关卡可见性筛选
- `ULyraReplicationGraphNode_PlayerStateFrequencyLimiter` — PlayerState 复制频率限制，大规模联机优化
- `ULyraReplicationGraphSettings` — 复制图设置资产，`EClassRepNodeMapping` 枚举 + `FRepGraphActorClassSettings`
- `FGameplayTagStack` / `FGameplayTagStackContainer` — Tag 堆叠容器，FastArray 网络复制，增删改查
- `ULyraGameEngine` — GameEngine 子类，Init 阶段注入 Lyra 自定义逻辑
- `ALyraGameSession` — 游戏会话，重写自动登录行为、比赛开始/结束处理
- `ULyraSignificanceManager` — 重要性管理器，基于距离/可见性动态调整 Actor 更新频率
- `ULyraActorUtilities` — Actor 工具函数库
- `ULyraDevelopmentStatics` — 开发工具静态函数
- `ULyraSystemStatics` — 系统工具静态函数

### 12. Interaction

- `IInteractableTarget` — 可交互目标接口，`GatherInteractionOptions(FInteractionOptionBuilder&)`
- `FInteractionOptionBuilder` — 交互选项构建器，批量构建 `FInteractionOption` 并关联到自身
- `IInteractionInstigator` — 交互发起者接口，仲裁多选项选择
- `FInteractionOption` — 交互选项结构体（文本、要授予的能力类、目标 ASC 句柄、UI Widget 类）
- `FInteractionQuery` — 交互查询结构体（请求 Pawn、Controller、附加数据）
- `UInteractionStatics` — 蓝图函数库，从 Actor/Overlap/HitResult 提取 `IInteractableTarget` 接口
- `ULyraGameplayAbility_Interact` — 交互能力实现
- `AGameplayAbilityTargetActor_Interact` — 交互 TargetActor
- `UAbilityTask_GrantNearbyInteraction` — 附近交互授权 AbilityTask
- `UAbilityTask_WaitForInteractableTargets` — 等待可交互目标 AbilityTask
- `UAbilityTask_WaitForInteractableTargets_SingleLineTrace` — 单线迹等待可交互目标 AbilityTask
- `FLyraInteractionDurationMessage` — 交互持续时间消息（发起者 + 秒数），通过 GameplayTag 消息系统广播

### 13. Messages

- `FLyraVerbMessage` — 通用动词消息（Instigator-Verb-Target-Context-Magnitude 五元组）
- `FLyraVerbMessageReplicationEntry` — 单个动词消息的网络复制条目（FastArray Element）
- `FLyraVerbMessageReplication` — 动词消息复制容器（FastArray），服务器广播到客户端
- `UGameplayMessageProcessor` — 消息处理器基类，监听 `UGameplayMessageSubsystem`，服务端处理与转发
- `FLyraNotificationMessage` — 通知消息（目标频道 Tag、目标玩家、通知文本、额外负载标签/对象）
- `ULyraVerbMessageHelpers` — 蓝图函数库，`FLyraVerbMessage` ↔ `FGameplayCueParameters` 互转等工具方法

### 14. Audio

- `ULyraAudioMixEffectsSubsystem`（WorldSubsystem）— 自动管理控制总线混音、HDR/LDR 音频效果链切换、加载界面混音
- `FLyraAudioSubmixEffectsChain` — Submix 效果链定义，Submix + SubmixEffectPreset 数组
- `ULyraAudioSettings` — 音频开发者设置（`UDeveloperSettings`），默认/加载界面/用户控制总线混音，各音量控制总线，HDR/LDR 效果链映射
- `FLyraSubmixEffectChainMap` — Submix → Preset 数组映射

### 15. Cosmetics

- `ULyraPawnComponent_CharacterParts` — Pawn 端部件组件，`FLyraCharacterPartList`（FastArray 复制），生成装饰 Actor 并收集 Cosmetic 标签
- `FLyraAppliedCharacterPartEntry` — 已应用部件条目（FastArray Element），部件定义 + 句柄 + 生成的 Actor
- `ULyraControllerComponent_CharacterParts` — Controller 端部件组件，拥有 Pawn 时自动生成装饰 Actor
- `FLyraControllerCharacterPartEntry` — Controller 端部件条目，部件定义 + 句柄 + 来源类型
- `FLyraCharacterPart` — 部件定义（Actor 类、挂接 Socket、碰撞模式 `ECharacterCustomizationCollisionMode`）
- `FLyraCharacterPartHandle` — 部件句柄，用于标识和移除已添加部件
- `FLyraAnimLayerSelectionSet` / `FLyraAnimLayerSelectionEntry` — 标签驱动的 AnimLayer 选择（首条匹配胜出）
- `FLyraAnimBodyStyleSelectionSet` / `FLyraAnimBodyStyleSelectionEntry` — 标签驱动的 SkeletalMesh + 物理资产选择
- `ULyraCosmeticCheats` — CheatManager 扩展，控制台命令增删替换角色装饰部件
- `ULyraCosmeticDeveloperSettings` — PIE 下装饰作弊配置，`ECosmeticCheatMode` 枚举

### 16. Feedback

- `ULyraContextEffectsSubsystem`（WorldSubsystem）— 基于 GameplayTag 上下文匹配自动生成 VFX/SFX
- `ULyraContextEffectsLibrary` — 效果库资产，`EContextEffectsLibraryLoadState` 加载状态
- `ULyraActiveContextEffects` — 激活的效果集合资产
- `ULyraContextEffectsSet` — 效果集资产
- `ULyraContextEffectsSettings` — 效果开发者设置
- `ULyraContextEffectComponent` — Actor 上下文效果组件
- `ILyraContextEffectsInterface` — 效果上下文接口，`EEffectsContextMatchType` 枚举
- `UAnimNotify_LyraContextEffects` — 动画通知触发表面效果（VFX/Audio/Trace 设置 + 预览）
- `ULyraNumberPopComponent` — 浮动数字弹窗组件基类，`FLyraNumberPopRequest` 请求结构
- `ULyraNumberPopComponent_MeshText` — Mesh 文本数字弹窗，缓存池管理（`FPooledNumberPopComponentList`/`FLiveNumberPopEntry`）
- `ULyraNumberPopComponent_NiagaraText` — Niagara 文本数字弹窗
- `ULyraDamagePopStyle` / `ULyraDamagePopStyleNiagara` — 伤害弹窗样式数据资产

### 17. Performance

- `ULyraPerformanceStatSubsystem`（GameInstanceSubsystem）— 性能统计，`ELyraDisplayablePerformanceStat` 枚举（FPS/ServerFPS/IdleTime/FrameTime/Ping/丢包/Latency 等），蓝图访问接口
- `FLyraPerformanceStatCache` — 性能统计帧观察者（IPerformanceDataConsumer），环形缓冲记录多指标
- `FSampledStatCache` — 采样统计缓存，Min/Max/Average 统计
- `ULyraPerformanceSettings` — 性能项目配置（桌面帧率限制列表、统计组集合）
- `ULyraPlatformSpecificRenderingSettings` — 平台渲染设置（设备配置后缀、帧率模式 `ELyraFramePacingMode`、画质选项）
- `FLyraQualityDeviceProfileVariant` — 画质设备配置变体（质量名称、设备配置后缀、最低刷新率）
- `FLyraPerformanceStatGroup` — 性能统计组，通过平台特性查询过滤可显示统计
- `ELyraStatDisplayMode` — 统计显示模式（隐藏/纯文本/纯图表/文本与图表）

### 18. Settings

- `ULyraSettingsLocal`（继承 `UGameUserSettings`）— 本机设置：帧率限制、画质等级、设备配置、音量、HDR 音频、安全区等
- `ULyraSettingsShared`（继承 `ULocalPlayerSaveGame`）— 可云同步设置：`EColorBlindMode` 色盲模式、手柄震动/死区、字幕、鼠标/手柄灵敏度、语言、`ELyraAllowBackgroundAudioSetting`
- `ULyraGameSettingRegistry` — 设置注册表，初始化视频/音频/游戏/键鼠/手柄等所有设置页面
- `FLyraScalabilitySnapshot` — 可伸缩性快照（画质等级 + 激活标志）
- `ULyraSettingAction_SafeZoneEditor` — 安全区编辑设置动作
- `ULyraSettingKeyboardInput` — 键盘输入设置
- `ULyraSettingValueDiscreteDynamic_AudioOutputDevice` — 音频输出设备设置
- `ULyraSettingValueDiscrete_Language` — 语言选择设置
- `ULyraSettingValueDiscrete_MobileFPSType` — 移动端 FPS 类型设置
- `ULyraSettingValueDiscrete_OverallQuality` — 总体画质设置
- `ULyraSettingValueDiscrete_PerfStat` — 性能统计显示设置
- `ULyraSettingValueDiscrete_Resolution` — 分辨率设置
- `ULyraBrightnessEditor` — 亮度编辑界面
- `ULyraSafeZoneEditor` — 安全区编辑界面
- `ULyraSettingsListEntrySetting_KeyboardInput` — 键盘输入设置列表项 Widget

### 19. Physics

- `LyraCollisionChannels.h`（宏定义）— `Lyra_TraceChannel_Interaction`/`Weapon`/`Weapon_Capsule`/`Weapon_Multi` 绑定到 `GameTraceChannel1-5`
- `UPhysicalMaterialWithTags` — 带 GameplayTag 容器（`FGameplayTagContainer`）的物理材质，游戏逻辑通过 Tag 判定/处理材质类型（如穿透倍率计算）

### 20. Replays

- `ULyraReplaySubsystem`（GameInstanceSubsystem）— 录像管理：播放/录制客户端录像/清理本地录像/时间跳转/枚举流
- `ULyraReplayListEntry` — 单个录像条目，封装 `FNetworkReplayStreamInfo`，友好名称/时间戳/时长/观众数
- `ULyraReplayList` — 录像列表容器
- `UAsyncAction_QueryReplays` — 异步查询录像列表蓝图动作，`QueryComplete` 委托
- `ALyraReplayPlayerController` — 回放专用 PlayerController（位于 Player/ 目录）

---

## 3. Plugins

### 21. ModularGameplayActors

- `AModularCharacter` (extends `ACharacter`) — 重写 `PreInitializeComponents`/`BeginPlay`/`EndPlay`，集成 ModularGameplay 框架
- `AModularPlayerController` (extends `APlayerController`) — 重写 `PreInitializeComponents`/`EndPlay`/`ReceivedPlayer`/`PlayerTick`
- `AModularPawn` (extends `APawn`) — 非角色 Pawn 模块化基类
- `AModularGameMode` (extends `AGameMode`) — 模块化 GameMode
- `AModularGameModeBase` (extends `AGameModeBase`) — 模块化 GameModeBase（Lyra 实际使用此基类）
- `AModularGameState` (extends `AGameState`) — 模块化 GameState
- `AModularGameStateBase` (extends `AGameStateBase`) — 模块化 GameStateBase（Lyra 实际使用此基类）
- `AModularPlayerState` (extends `APlayerState`) — 模块化 PlayerState
- `AModularAIController` (extends `AAIController`) — 模块化 AI Controller

### 22. CommonGame

- `UCommonGameInstance` (extends `UGameInstance`) — 扩展用户管理、系统消息处理、特权变更、用户初始化、Session 加入流（平台邀请）、主玩家追踪、`AddLocalPlayer`/`RemoveLocalPlayer`/`ReturnToMainMenu`
- `UCommonLocalPlayer` (extends `ULocalPlayer`) — `OnPlayerControllerSet`/`OnPlayerStateSet`/`OnPlayerPawnSet` 委托，`CallAndRegister_` 延迟注册模式，持有 `UPrimaryGameLayout` 引用
- `ACommonPlayerController` (extends `AModularPlayerController`) — 钩子 `ReceivedPlayer`/`SetPawn`/`OnPossess`/`OnUnPossess`/`OnRep_PlayerState` 触发 `UCommonLocalPlayer` 委托
- `UPrimaryGameLayout` — 每玩家根 UI Widget，多层 Layer（`UI.Layer.*` GameplayTag），`PushWidgetToLayerStack`/`PushWidgetToLayerStackAsync`（异步加载），Dormant 模式
- `UGameUIManagerSubsystem` (abstract) — 管理 `UGameUIPolicy`，通知玩家增删
- `UCommonMessagingSubsystem` / `UCommonGameDialog` — 确认/取消弹窗系统

### 23. CommonUser

- `UCommonUserSubsystem` (extends `UGameInstanceSubsystem`) — 管理本地多人用户：本地游戏初始化、在线登录、访客用户、特权检查、平台特性标签、"按任意键开始" 分屏监听
- `UCommonUserInfo` — 单个用户状态：平台用户 ID、输入设备、本地玩家索引、访客状态、初始化状态、缓存 NetId/Nickname/特权结果、`IsLoggedIn()`/`GetNetId()`/`GetNickname()`
- `FCommonUserInitializeParams` — 初始化参数（本地玩家索引、输入设备、请求特权、访客设置、在线上下文）
- `FCommonUserTags` — 系统消息 GameplayTag（错误/警告/显示）和平台特性 Tag（严格手柄映射、单人）
- `FOnlineContextCache` — 按在线上下文（Game/Platform/Service）缓存 OSS 指针和连接状态

### 24. CommonLoadingScreen

- `ULoadingScreenManager` (extends `UGameInstanceSubsystem` + `FTickableGameObject`) — 加载界面生命周期管理，监听 `PreLoadMap`/`PostLoadMap`，每帧检查加载状态 + `ILoadingProcessInterface` 处理器，显示/隐藏 Widget，输入阻断，最短显示时间
- `ILoadingProcessInterface` — 系统实现此接口可扩展加载屏幕显示条件（如匹配、资源流式加载）
- `ULoadingProcessTask` — 蓝图可用加载过程 Task
- 插件还包括 `CommonStartupLoadingScreen` 模块（PreLoadingScreen 阶段，仅客户端）

### 25. UIExtension

- `UUIExtensionSubsystem` (extends `UGameInstanceSubsystem` + `FTickableGameObject`) — 管理 GameplayTag 键控 ExtensionPoint → Extension 映射，优先级排序，`Added`/`Removed` 动作通知
- `FUIExtensionPointHandle` / `FUIExtensionHandle` — C++/蓝图可用的注册/注销句柄
- `FUIExtensionRequest` — 传递给 ExtensionPoint 回调的结构（句柄、Tag、优先级、数据对象、上下文）
- `UUIExtensionPointWidget` (extends `UDynamicEntryBoxBase`) — 代表 UI 布局插槽的 Widget，注册 ExtensionPoint，动态创建扩展 Widget，`GetWidgetClassForData`/`ConfigureWidgetForData` 委托
- `EUIExtensionPointMatch` — 精确/部分 Tag 匹配

### 26. GameplayMessageRouter

- `UGameplayMessageSubsystem` (extends `UGameInstanceSubsystem`) — GameplayTag Channel 发布/订阅消息总线，`BroadcastMessage<FMessageStructType>(Channel, Message)` 模板分发，`RegisterListener<FMessageStructType>(Channel, Callback)` 类型安全，精确/部分 Tag 匹配
- `FGameplayMessageListenerHandle` — 监听器不透明句柄，`Unregister()` 移除
- `EGameplayMessageMatch` — ExactMatch / PartialMatch
- `FGameplayMessageListenerParams` — 高级注册参数（匹配类型 + 回调 + 弱成员绑定）
- `UAsyncAction_ListenForGameplayMessage` — 蓝图异步监听节点（`UAsyncAction` 子类）
- `UK2Node_AsyncAction_ListenForGameplayMessages` — K2 蓝图节点

### 27. GameSettings

- `UGameSetting` (abstract) — 任何游戏设置的抽象基类，Dev Name/Display Name/Description/GameplayTags/Dynamic Details/Edit Conditions/Dependencies，异步初始化，Change/Apply 事件，分析上报
- `UGameSettingRegistry` — 拥有 `ULocalPlayer` 的顶层设置，支持重新生成、过滤（`FGameSettingFilterState`）、保存更改
- `UGameSettingValue` / `UGameSettingValueDiscrete` / `UGameSettingValueScalar` — 类型化设置值基类
- `FGameSettingEditCondition` 子类（`WhenCondition`/`WhenPlatformHasTrait`/`WhenPlayingAsPrimaryPlayer`）— 控制设置可见性/可编辑性
- Widgets: `UGameSettingScreen`/`UGameSettingPanel`/`UGameSettingListEntry`/`UGameSettingListView`

### 28. GameSubtitles

- `USubtitleDisplaySubsystem` (extends `UGameInstanceSubsystem`) — 字幕显示配置管理，`FDisplayFormatChangedEvent` 广播，文本大小/颜色/边框/背景不透明度
- `USubtitleDisplayOptions` (extends `UDataAsset`) — 字幕视觉外观定义（字体、文本大小、文本颜色、边框大小、背景不透明度、背景画刷）
- `FSubtitleFormat` — 运行时字幕格式首选项
- `ESubtitleDisplayTextSize` / `ESubtitleDisplayTextColor` / `ESubtitleDisplayTextBorder` / `ESubtitleDisplayBackgroundOpacity` — 字幕显示枚举

### 29. AsyncMixin

- `FAsyncMixin` — 零开销 Mixin 类（不可复制），`CancelAsyncLoading()` → `AsyncLoad(softPointer)` → `StartAsyncLoading()`，序列化执行异步加载请求，保证回调严格顺序，安全处理 `[this]` 捕获（析构时取消），`AsyncPreloadPrimaryAssetsAndBundles`、`AsyncCondition`（自定义完成条件）、`AsyncEvent`（内联回调）
- `FAsyncScope` — 独立 RAII 版本 `FAsyncMixin`，无需继承即可使用
- `FAsyncCondition` — 自定义条件，暂停异步序列直到 `Complete` 委托触发
- 内部状态通过静态 `TMap` 外挂，零内存开销

### 30. PocketWorlds

- `UPocketLevelSubsystem` (extends `UWorldSubsystem`) — `GetOrCreatePocketLevelFor(ULocalPlayer, UPocketLevel, SpawnPoint)`，按玩家管理口袋关卡
- `UPocketLevelInstance` — 单个口袋关卡运行时实例，`ULevelStreamingDynamic` 流式加载/卸载，`OnReadyEvent` 就绪委托，包围盒跟踪
- `UPocketLevel` — 数据资产，定义要流式加载的子关卡

### 31. LyraExampleContent

- 纯内容插件（`CanContainContent: true`），无 C++ 模块
- 提供 Lyra 示例项目所需的地图全景、蓝图模板、数据资产、示例内容等
- 多个 GameFeature 插件（ShooterCore、TopDownArena 等）依赖此插件的示例内容

---

## 4. Reading Guide

| 目标 | 推荐入口 |
|---|---|
| 理解整体初始化流程 | `LyraGameMode.cpp` → `LyraExperienceManagerComponent.cpp` |
| 理解 GAS 如何接入 | `LyraAbilitySystemComponent.h` → `LyraAbilitySet.h` → `GameFeatureAction_AddAbilities.cpp` |
| 理解角色生命周期 | `LyraPawnExtensionComponent.cpp` → `LyraHeroComponent.cpp` |
| 理解输入到能力激活 | `LyraInputComponent.h` → `LyraHeroComponent::InitializePlayerInput` → `LyraAbilitySystemComponent::ProcessAbilityInput` |
| 理解装备/武器系统 | `LyraEquipmentDefinition.h` → `LyraEquipmentManagerComponent.cpp` → `LyraGameplayAbility_RangedWeapon.h` |
| 理解 GameFeature 扩展 | `ShooterCore.uplugin` → `B_ShooterGame_Elimination.uasset` (Experience) → `LAS_ShooterGame_StandardHUD.uasset` (ActionSet) |
| 理解 UI 系统 | `LyraHUD.h` → `UIExtension` 插件 → `GameFeatureAction_AddWidget.cpp` |
