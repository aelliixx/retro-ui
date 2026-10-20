import { screen } from "@testing-library/react";
import { useEffect } from "react";
import { describe, expect, it } from "vitest";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  AspectRatio,
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Dialog,
  Field,
  Input,
  LoadingIcon,
  Menu,
  MenuBar,
  MenuItem,
  MenuSeparator,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  Pagination,
  PaginationNext,
  PaginationPager,
  PaginationPrev,
  PasswordToggleField,
  Progress,
  Radio,
  RadioGroup,
  ScrollArea,
  Select,
  Separator,
  Skeleton,
  Slider,
  Status,
  Switch,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  ToastProvider,
  Toggle,
  ToggleGroup,
  ToggleGroupItem,
  Tooltip,
  useToast,
} from "@/components/ui";
import { expectNoA11yViolations } from "@/test/axe";

/** pushes a toast so the live region has something in it */
function ToastTrigger() {
  const toast = useToast();
  useEffect(() => {
    toast.info("Saved", "The file is on disk.");
  }, [toast]);
  return null;
}

describe("accessibility audit", () => {
  it("Accordion", async () => {
    await expectNoA11yViolations(
      <Accordion>
        <AccordionItem>
          <AccordionTrigger>Getting started</AccordionTrigger>
          <AccordionContent>Install the package and import a component.</AccordionContent>
        </AccordionItem>
        <AccordionItem>
          <AccordionTrigger>Theming</AccordionTrigger>
          <AccordionContent>Override the CSS variables.</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
  });

  it("AspectRatio", async () => {
    await expectNoA11yViolations(
      <AspectRatio className="w-64">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/wallpaper.png" alt="Teal wallpaper" />
      </AspectRatio>,
    );
  });

  it("Avatar", async () => {
    await expectNoA11yViolations(
      <div className="flex gap-3">
        <Avatar name="Ada Lovelace" status="online" />
        <Avatar name="Grace Hopper" />
      </div>,
    );
  });

  it("Badge", async () => {
    await expectNoA11yViolations(
      <div className="flex gap-2">
        <Badge>new</Badge>
        <Badge variant="outline" tone="danger">
          breaking
        </Badge>
        <Badge variant="subtle" tone="success">
          stable
        </Badge>
      </div>,
    );
  });

  it("Button", async () => {
    await expectNoA11yViolations(
      <div className="flex gap-2">
        <Button>Save</Button>
        <Button variant="primary">Install</Button>
        <Button variant="destructive">Delete</Button>
        <Button disabled>Unavailable</Button>
      </div>,
    );
  });

  it("Card", async () => {
    await expectNoA11yViolations(
      <Card>
        <CardHeader>
          <CardTitle>Properties</CardTitle>
        </CardHeader>
        <CardDescription>Read-only attributes</CardDescription>
        <CardContent>Body</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>,
    );
  });

  it("Checkbox", async () => {
    await expectNoA11yViolations(
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2">
          <Checkbox defaultChecked />
          Include hidden files
        </label>
        <label className="flex items-center gap-2">
          <Checkbox disabled />
          Scan network drives
        </label>
      </div>,
    );
  });

  it("Collapsible", async () => {
    await expectNoA11yViolations(
      <Collapsible>
        <CollapsibleTrigger>Advanced</CollapsibleTrigger>
        <CollapsibleContent>Panel body</CollapsibleContent>
      </Collapsible>,
    );
  });

  it("Dialog", async () => {
    await expectNoA11yViolations(
      <Dialog title="Careful" defaultOpen>
        Something happened.
      </Dialog>,
    );
  });

  it("Field", async () => {
    await expectNoA11yViolations(
      <Field label="Username" hint="Letters and digits">
        <Input />
      </Field>,
    );
  });

  it("Input", async () => {
    await expectNoA11yViolations(
      <Field label="Username">
        <Input />
      </Field>,
    );
  });

  it("LoadingIcon", async () => {
    await expectNoA11yViolations(<LoadingIcon />);
  });

  it("MenuBar", async () => {
    await expectNoA11yViolations(
      <MenuBar label="File">
        <Menu label="File">
          <MenuItem>New</MenuItem>
          <MenuSeparator />
          <MenuItem shortcut="Ctrl+S">Save</MenuItem>
        </Menu>
      </MenuBar>,
    );
  });

  it("NavigationMenu", async () => {
    await expectNoA11yViolations(
      <NavigationMenu label="Main" defaultValue="products">
        <NavigationMenuList>
          <NavigationMenuItem value="products">
            <NavigationMenuTrigger>Products</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink href="/products/widget">Widget</NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>,
    );
  });

  it("Pagination", async () => {
    await expectNoA11yViolations(
      <Pagination defaultPage={4} totalPages={12}>
        <PaginationPrev />
        <PaginationPager />
        <PaginationNext />
      </Pagination>,
    );
  });

  it("PasswordToggleField", async () => {
    await expectNoA11yViolations(
      <PasswordToggleField label="Password" hint="At least 8 characters" />,
    );
  });

  it("Progress", async () => {
    await expectNoA11yViolations(
      <Progress value={40} aria-label="Copy progress" />,
    );
  });

  it("RadioGroup", async () => {
    await expectNoA11yViolations(
      <RadioGroup label="Speed" defaultValue="slow">
        <Radio value="slow">Slow</Radio>
        <Radio value="fast">Fast</Radio>
      </RadioGroup>,
    );
  });

  it("ScrollArea", async () => {
    await expectNoA11yViolations(
      <ScrollArea label="File list">Lots of files</ScrollArea>,
    );
  });

  it("Select", async () => {
    await expectNoA11yViolations(
      <Field label="Drive">
        <Select>
          <option value="c">C:</option>
          <option value="d">D:</option>
        </Select>
      </Field>,
    );
  });

  it("Separator", async () => {
    await expectNoA11yViolations(
      <div>
        <p>Above</p>
        <Separator />
        <p>Below</p>
      </div>,
    );
  });

  it("Skeleton", async () => {
    await expectNoA11yViolations(
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton>
          <Button>Save</Button>
        </Skeleton>
      </div>,
    );
  });

  it("Slider", async () => {
    await expectNoA11yViolations(
      <Field label="Volume">
        <Slider />
      </Field>,
    );
  });

  it("Status", async () => {
    await expectNoA11yViolations(
      <div className="flex gap-4">
        <Status value="online" />
        <Status value="busy" label="In a meeting" />
      </div>,
    );
  });

  it("Switch", async () => {
    await expectNoA11yViolations(
      <label className="flex items-center gap-2">
        <Switch defaultChecked />
        Power the drive
      </label>,
    );
  });

  it("Table", async () => {
    await expectNoA11yViolations(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Size</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>document.txt</TableCell>
            <TableCell>12 KB</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>4 objects</TableCell>
          </TableRow>
        </TableFooter>
        <TableCaption>Objects</TableCaption>
      </Table>,
    );
  });

  it("Tabs", async () => {
    await expectNoA11yViolations(
      <Tabs defaultValue="files">
        <TabsList>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="network">Network</TabsTrigger>
        </TabsList>
        <TabsContent value="files">Files panel</TabsContent>
        <TabsContent value="network">Network panel</TabsContent>
      </Tabs>,
    );
  });

  it("Textarea", async () => {
    await expectNoA11yViolations(
      <Field label="Notes">
        <Textarea />
      </Field>,
    );
  });

  it("Toast", async () => {
    await expectNoA11yViolations(
      <ToastProvider>
        <ToastTrigger />
      </ToastProvider>,
    );

    // the toast itself must be on screen, or the audit above had nothing
    // to look at in the live region
    expect(screen.getByText("Saved")).toBeInTheDocument();
  });

  it("Toggle", async () => {
    await expectNoA11yViolations(<Toggle>Bold</Toggle>);
  });

  it("ToggleGroup", async () => {
    await expectNoA11yViolations(
      <ToggleGroup aria-label="Alignment" defaultValue="left">
        <ToggleGroupItem value="left">Left</ToggleGroupItem>
        <ToggleGroupItem value="center">Center</ToggleGroupItem>
      </ToggleGroup>,
    );
  });

  it("Tooltip", async () => {
    await expectNoA11yViolations(
      <Tooltip content="Save the document">
        <Button>Save</Button>
      </Tooltip>,
    );
  });
});
